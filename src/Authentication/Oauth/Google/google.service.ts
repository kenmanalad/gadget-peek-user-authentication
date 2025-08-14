import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { GoogleDTO } from "./google.dto";
import { PrismaService } from "src/Common/Services/Prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { HttpService } from "@nestjs/axios";
import { UAParser } from "ua-parser-js";
import { TokenService } from "src/Common/Services/Utils/token.service";
@Injectable()
export class GoogleService{
    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService,
        private httpService: HttpService,
        private tokenService: TokenService
    ){}


    private async verifyProfile(googleClientID: string, googleClientSecret: string, googleRedirectURL: string, code: string){
        
        const oauthClient = new OAuth2Client(
            googleClientID,
            googleClientSecret,
            googleRedirectURL
        );


        const tokens = await oauthClient.getToken(code);


        if(!tokens.tokens) throw new UnauthorizedException(
            'Your login session has expired or the authorization code is invalid. Please try logging in again or contact support for assistance.');
        

        await oauthClient.setCredentials(tokens.tokens);
        const profile = await google.oauth2("v2").userinfo.get({auth: oauthClient});


        // This HTTP request will be used to send Google profile data to the profile service 
        // once the profile microservice is implemented and running.
        // await this.httpService.post(this.configService.get<string>('PROFILE_SERVICE_URI'),{
        //     email: profile.data.email,
        //     firstName: profile.data.given_name,
        //     lastName: profile.data.family_name,
        //     profilePic: profile.data.picture,
        //     gender: profile.data.gender
        // });

        if(!profile) throw new UnauthorizedException('Failed to retrieve user profile from Google. Please try again.');

        return tokens.tokens.refresh_token;


    }

    async googleAuth(googleAuthDetails: GoogleDTO, response: Response, userAgent: string){
        const foundOrCreated = await this.prismaService.findOrCreateUser(googleAuthDetails.emailAddress);
        
        //Format = {sucess: boolean, message: string, user: userObject || null}
        if(!foundOrCreated.success || !foundOrCreated.user) return foundOrCreated;

        const user = foundOrCreated.user;

        const googleClientID = this.configService.get<string>('GOOGLE_CLIENT_ID');
        const googleClientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
        const googleRedirectURL = this.configService.get<string>('GOOGLE_REDIRECT_URL');

        if(!googleClientID || !googleClientSecret || !googleRedirectURL) throw new InternalServerErrorException("We are experiencing a temporary error right now. Please contact an agent.");

        const { browser, device } = UAParser(userAgent);

        const refreshTokenGoogle = await this.verifyProfile(googleClientID, googleClientSecret,googleRedirectURL, googleAuthDetails.code);

        if(!refreshTokenGoogle) throw new UnauthorizedException("Failed to retrieve user profile from Google. Please try again.");

        await this.prismaService.refreshToken.create({
            data: {
                refreshToken: refreshTokenGoogle,
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

        return {
            success: true,
            message: "User successfully signed in",
            access_token: access_token
        }

    }
}