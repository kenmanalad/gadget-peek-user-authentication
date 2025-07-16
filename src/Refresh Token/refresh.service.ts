import { Injectable, UnauthorizedException } from "@nestjs/common";
import { RefreshTokenDTO } from "./refresh.dto";
import { PrismaService } from "src/Prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { CryptService } from "src/Common/Services/crypt.service";
import { UAParser } from 'ua-parser-js';
import { connect } from "http2";
import { TokenService } from "src/Common/Services/token.service";
import { Response } from "express";

@Injectable()
export class RefreshService{
    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService,
        private jwtService: JwtService,
        private cryptService: CryptService,
        private tokenService: TokenService
    ){}
    async verifyRefreshToken(refreshTokenDetails: RefreshTokenDTO, userAgent: string, response: Response){

        const { browser, device } = UAParser(userAgent);

        const verified = await this.jwtService.verifyAsync(refreshTokenDetails.refreshToken, 
                {
                    secret: this.configService.get<string>('REFRESH_TOKEN_SECRET')
                }
            );


        const savedRefreshToken = await this.prismaService.refreshToken.findFirst({
            where: {
                userId: verified.sub
            }
        });


        if(!savedRefreshToken || savedRefreshToken?.expirationDate < new Date() || !savedRefreshToken.isValid)
            throw new UnauthorizedException("Your session has expired, Please sign in again.", {
                        cause: "The refresh token is either expired or invalid"
                    });
        
        const isTokenValid = await this.cryptService.verifyData(refreshTokenDetails.refreshToken, savedRefreshToken.refreshToken);


        if(!isTokenValid) throw new UnauthorizedException("Your session has expired, Please sign in again.", {
                        cause: "The refresh token does not match the recorded token"
                    });

                    
        await this.prismaService.refreshToken.delete({
            where: {
                id: savedRefreshToken.id
            }
        });

        const { access_token, refresh_token } = await this.tokenService.produceToken(
            verified.emailAddress,
            verified.sub,
            browser.name ?? "unknown",
            device.model ?? "unknown"
        );

        response.cookie("refresh_token", refresh_token,{
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        

        return {
            success: true,
            message: "New access token generated.",
            access_token: access_token
        }
    }
}