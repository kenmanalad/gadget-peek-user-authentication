import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthDTO } from "./auth.dto";
import { PrismaService } from "src/Prisma/prisma.service";
import { CryptService } from "src/Common/Services/crypt.service";
import { Response } from "express";
import { TokenService } from "src/Common/Services/token.service";
import { UAParser } from 'ua-parser-js';




@Injectable({})
export class AuthService{
    constructor(
        private prismaService: PrismaService,
        private passwordService: CryptService,
        private tokenService: TokenService
    ){}
    async manualSignin(signinDetails: AuthDTO, response: Response, userAgent: string){


        const { browser, device } = UAParser(userAgent);

        const verifiedUser = await this.prismaService.verifiedUser.findUnique({
                where:{
                    emailAddress: signinDetails.emailAddress
                }
        });

        if(!verifiedUser) throw new UnauthorizedException("This email address is not registered or verified");

        if(!verifiedUser.password) throw new UnauthorizedException("Password must not be empty");

        const isValid = await this.passwordService.verifyData(signinDetails.password, verifiedUser?.password);

        if(!isValid) throw new UnauthorizedException('The password you entered is incorrect.');

        const { access_token, refresh_token } = await this.tokenService.produceToken(
            verifiedUser.emailAddress, 
            verifiedUser.id,
            browser.name ?? 'unknown',
            device.model ?? 'unknown'
        );
        


        response.cookie("refresh_token", refresh_token,{
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return{
                success: true,
                message: "Signed in successfully",
                status: 200,
                access_token: access_token
        }
    
    }
}