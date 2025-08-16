import { Injectable, UnauthorizedException } from "@nestjs/common";
import { RefreshTokenDTO } from "./refresh.dto";
import { PrismaService } from "src/Common/Services/Prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { CryptService } from "src/Common/Services/Utils/crypt.service";
import { UAParser } from 'ua-parser-js';
import { connect } from "http2";
import { TokenService } from "src/Common/Services/Utils/token.service";
import { Response } from "express";
import { MetaResponseService } from "src/Common/Services/Utils/meta.response.service";

@Injectable()
export class RefreshService{
    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService,
        private jwtService: JwtService,
        private cryptService: CryptService,
        private tokenService: TokenService,
        private metaService: MetaResponseService
    ){}
    async verifyRefreshToken(token: string, userAgent: string, response: Response){

        const { browser, device } = UAParser(userAgent);

        const verified = await this.jwtService.verifyAsync(token, 
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
        
        const isTokenValid = await this.cryptService.verifyData(token, savedRefreshToken.refreshToken);


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
            device.model ?? "unknown",
            verified.role
        );

        response.cookie("refresh_token", refresh_token,{
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        

        const meta = this.metaService.meta();
        return {
            success: true,
            message: "New access token generated.",
            tokens: {
                access_token
            },
            meta
        }
    }
}