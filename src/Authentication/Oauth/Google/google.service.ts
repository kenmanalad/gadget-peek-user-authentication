import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { GoogleDTO } from "./google.dto";
import { PrismaService } from "src/Common/Services/Prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { HttpService } from "@nestjs/axios";
import { UAParser } from "ua-parser-js";
import { TokenService } from "src/Common/Services/Utils/token.service";
import { logger } from "src/Common/Services/Utils/logger";
import { lastValueFrom } from "rxjs";
import { timeStamp } from "console";
@Injectable()
export class GoogleService{
    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService,
        private httpService: HttpService,
        private tokenService: TokenService
    ){}


    private async verifyProfile(googleClientID: string, googleClientSecret: string, googleRedirectURL: string, code: string, userID: number){
        
        const oauthClient = new OAuth2Client(
            googleClientID,
            googleClientSecret,
            googleRedirectURL
        );


        const tokens = await oauthClient.getToken(code);


        if(!tokens.tokens) {
            logger.error({
                cause: "GOOGLE_SERVICE_ERROR_TOKENS",
                message: "Failed to retrieve tokens from google."
            });
            throw new UnauthorizedException(
            'Your login session has expired or the authorization code is invalid. Please try logging in again or contact support for assistance.');
        }
        

        await oauthClient.setCredentials(tokens.tokens);
        const profile = await google.oauth2("v2").userinfo.get({auth: oauthClient});


        if(!profile){
            logger.error({
                cause: "OAUTH_PROFILE_RETRIEVAL_ERROR",
                message: "Failed to retrieve profile information from google"
            })
            throw new UnauthorizedException('Failed to retrieve user profile from Google. Please try again later.');
        }



        return {
            token: tokens.tokens.refresh_token,
            profile
        };


    }

    async googleAuth(googleAuthDetails: GoogleDTO, response: Response, userAgent: string){
        const foundOrCreated = await this.prismaService.findOrCreateUser(googleAuthDetails.emailAddress);
        
        //Format = {sucess: boolean, message: string, user: userObject || null}
        if(!foundOrCreated.success || !foundOrCreated.user) return foundOrCreated;

        const user = foundOrCreated.user;

        const defaultErrorMessage = "We are experiencing a temporary issue right now. Please contact an agent to resolve this issue.";

        const googleClientID = this.configService.get<string>('GOOGLE_CLIENT_ID');
        const googleClientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
        const googleRedirectURL = this.configService.get<string>('GOOGLE_REDIRECT_URL');

        if(!googleClientID || !googleClientSecret || !googleRedirectURL) {
            logger.error({
                cause: "GOOGLE_SERVICE_ERROR_MISSING_CREDENTIALS",
                message: "Missing required credentials for google connection."
            });
            throw new InternalServerErrorException(defaultErrorMessage)
        };

        const { browser, device } = UAParser(userAgent);

        const {token, profile} = await this.verifyProfile(googleClientID, googleClientSecret,googleRedirectURL, googleAuthDetails.code, foundOrCreated.user.id);

        if(!token) throw new UnauthorizedException("Failed to retrieve user profile from Google. Please try again.");

        const profileRegistrationURL = this.configService.get<string>('PROFILE_SERVICE_ROUTE_REGISTRATION');

        if(!profileRegistrationURL){
            logger.error({
                cause: "OAUTH_PROFILE_REGISTRATION_ERROR_MISSING_URL",
                message: "Unable to locate URL for profile service."
            });

            throw new InternalServerErrorException(defaultErrorMessage);
        }

        const registered = await lastValueFrom(
            this.httpService.post(profileRegistrationURL, {
                firstName: profile.data.given_name,
                lastName: profile.data.family_name,
                profilePic: profile.data.picture,
                gender: profile.data.gender,
                userID: foundOrCreated.user.id
            })
        );


        if(!registered.data.success){
            logger.error({
                cause: "GOOGLE_SERVICE_ERROR_FAILED_TO_REGISTER",
                message: "Failed to register profile from google to profile service."
            });

            throw new BadRequestException(registered.data.message);
        }

        await this.prismaService.refreshToken.create({
            data: {
                refreshToken: token,
                verifiedUser: {
                        connect: { id: user.id },
                    },
                device: device.model ?? "unknown",
                browser: browser.name ?? "unknown",
                expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                generatedBy: "google"
            }
        });

        const { access_token, refresh_token } = await this.tokenService.produceToken(
            googleAuthDetails.emailAddress, 
            user.id, 
            browser.name ?? "unknown",
            device.model ?? "unknown",
            user.role
        );

        response.cookie("refresh_token", refresh_token,{
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const apiVersion = this.configService.get<string>('API_VERSION') ?? 1.0;
        return {
            success: true,
            message: "User successfully signed in",
            tokens: {
                access_token
            },
            meta:{
                timeStamp: new Date().toISOString(),
                apiVersion
            }
        }

    }
}