import { InternalServerErrorException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/Common/Services/Prisma/prisma.service";
import { logger } from "./logger"
import { Prisma } from "@prisma/client";
import { CryptService } from "./crypt.service";



interface TokenPair {
        access_token: string,
        refresh_token: string
}

@Injectable()
export class TokenService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private prismaService: PrismaService,
        private cryptService: CryptService
    ){
    }
    async forgotPasswordToken(emailAddress: string){
        let payload = {
            emailAddress,
            purpose: "forgot-password"
        }
        const token = await this.jwtService.signAsync(payload,
            {
                secret: this.configService.get<string>('FORGET_PASSWORD_TOKEN_SECRET'),
                expiresIn: '3m'
            }
        )

        return token;
    }
    async produceToken(emailAddress: string, id: number,browser: string, device: string, role: string): Promise<TokenPair>{
        let payload = { emailAddress, sub: id, role }

        const access_token = await this.jwtService.signAsync(payload);

        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
            expiresIn:'7d'
        },);


        const hashedRefreshToken = await this.cryptService.hashData(refresh_token);

        const savedRefreshToken = await this.saveRefreshToken(hashedRefreshToken, browser, device, id);
        if(!savedRefreshToken) throw new InternalServerErrorException('We are experiencing a temporary error. Please contact support.');

        return { access_token, refresh_token }
    
    }

    async saveRefreshToken(refreshToken: string,browser: string, device: string, id: number, generatedBy: string = "local"): Promise<boolean> {
        try {
            const EXPIRATION_DAYS = 7;
            const expirationDate = new Date(Date.now() + EXPIRATION_DAYS * 86400000);

            await this.prismaService.refreshToken.create({
                data: {
                    verifiedUser: {
                        connect: { id: id },
                    },
                    refreshToken,
                    browser,
                    device,
                    expirationDate,
                    generatedBy
                },
            });

            return true;

            } catch (error) {
                let message = 'Unexpected Prisma error';
                let status_code = 500;

                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    switch (error.code) {
                        case 'P2002':
                        message = 'Duplicate refresh token';
                        status_code = 409;
                        break;
                        case 'P2003':
                        message = 'Invalid user reference';
                        status_code = 400;
                        break;
                    }
                }

                logger.error({
                    message,
                    code: status_code,
                    cause: 'SAVING_REFRESH_TOKEN_ERROR',
                    error,
                });

                return false;
            }
        }
}