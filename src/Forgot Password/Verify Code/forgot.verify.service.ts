import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { VerifyCodeDTO } from "./forgot.verify.dto";
import { PrismaService } from "src/Common/Services/Prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TokenService } from "src/Common/Services/Utils/token.service";

@Injectable()
export class ForgotPasswordVerifyService{
    constructor(
        private prismaService: PrismaService,
        private tokenService: TokenService 

    ){}
    async verifyCode(forgotPasswordCredentials: VerifyCodeDTO){
        const now = Date.now();
        const forgotPasswordDetails = await this.prismaService.forgetPassword.findFirst({
            where: {
                emailAddress: forgotPasswordCredentials.emailAddress,
                code: forgotPasswordCredentials.code
            }
        });

        if(!forgotPasswordDetails) throw new BadRequestException("The email address/code you submitted is incorrect. Please use the correct input");

        if(now > forgotPasswordDetails.codeExpiration.getTime()) throw new UnauthorizedException("The code you submitted is expired. Please resend a code");

        const token = await this.tokenService.forgotPasswordToken(forgotPasswordDetails.emailAddress);

        await this.prismaService.forgetPassword.delete({
            where:{
                id: forgotPasswordDetails.id
            }
        });

        return {
            success: true,
            message: "The code is successfully verified.",
            token: token
        }
        

    }
}