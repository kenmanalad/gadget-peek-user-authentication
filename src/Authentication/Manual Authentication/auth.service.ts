import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthDTO } from "./auth.dto";
import { PrismaService } from "src/Common/Services/Prisma/prisma.service";
import { CryptService } from "src/Common/Services/Utils/crypt.service";
import { Response } from "express";
import { TokenService } from "src/Common/Services/Utils/token.service";
import { UAParser } from 'ua-parser-js';
import { logger } from "src/Common/Services/Utils/logger";
import { formatDateTime } from "src/Common/Services/Utils/formatDateTime";
import { timestamp } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { MetaResponseService } from "src/Common/Services/Utils/meta.response.service";




@Injectable({})
export class AuthService{
    constructor(
        private prismaService: PrismaService,
        private passwordService: CryptService,
        private tokenService: TokenService,
        private metaService: MetaResponseService
    ){}
    async manualSignin(signinDetails: AuthDTO, response: Response, userAgent: string){


        const { browser, device } = UAParser(userAgent);

        const verifiedUser = await this.prismaService.verifiedUser.findUnique({
                where:{
                    emailAddress: signinDetails.emailAddress
                }
        });

        if(!verifiedUser) {
            logger.error({
                cause: "AUTHENTICATION_ERROR_INCORRECT_CREDENTIALS",
                message: "User submitted incorrect credentials.",
                emailAddress: signinDetails.emailAddress
            });
            throw new UnauthorizedException("This email address is not registered or verified");
        };

        if(!verifiedUser.isActive){
            logger.error({
                cause: "AUTHENTICATION_ERROR_INACTIVE_ACCOUNT",
                message: "Inactive user trying to sign in.",
                emailAddress: verifiedUser.emailAddress,
                role: verifiedUser.role
            });
            throw new UnauthorizedException("Your account is currently deactivated. Please activate your account first before signing in");
        }

        if(!verifiedUser.password){
            logger.error({
                cause: "AUTHENTICATION_ERROR_NULL_PASSWORD",
                message: "User submitted a null password.",
                emailAddress: verifiedUser.emailAddress,
                role: verifiedUser.role
            });
            throw new UnauthorizedException("Password must not be empty");
        }

        const isValid = await this.passwordService.verifyData(signinDetails.password, verifiedUser?.password);

        if(!isValid){
            logger.error({
                cause: "AUTHENTICATION_ERROR_INCORRECT_PASSWORD",
                message: "User submitted an incorrect password.",
                emailAddress: verifiedUser.emailAddress,
                role: verifiedUser.role
            });
            throw new UnauthorizedException('The password you entered is incorrect.');
        }

        const { access_token, refresh_token } = await this.tokenService.produceToken(
            verifiedUser.emailAddress, 
            verifiedUser.id,
            browser.name ?? 'unknown',
            device.model ?? 'unknown',
            verifiedUser.role
        );
        


        response.cookie("refresh_token", refresh_token,{
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

    
        const meta = this.metaService.meta();
        return{
                success: true,
                message: "Signed in successfully",
                tokens: {
                    access_token
                },
                data: {
                    role: verifiedUser.role
                },
                meta

        }
    
    }
}