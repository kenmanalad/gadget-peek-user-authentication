import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/Common/Services/Prisma/prisma.service";
import { ChangePasswordDTO } from "./change.password.dto";
import { CryptService } from "src/Common/Services/Utils/crypt.service";
import { MailService } from "src/Common/Services/Utils/mail.service";
import { changePasswordEmail } from "src/Email Template/change.password.template";
import { NodeMailerService } from "src/Common/Services/NodeMailer/nodemailer.service";

@Injectable()
export class ChangePasswordService{
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private passwordService: CryptService,
        private mailService: MailService,
        private nodeMailerService: NodeMailerService
    ){}

    async changePassword(changePasswordCredentials: ChangePasswordDTO){

        const verified = await this.jwtService.verifyAsync(changePasswordCredentials.token,{
            secret: this.configService.get<string>('FORGET_PASSWORD_TOKEN_SECRET')
        });

        if(!verified) throw new UnauthorizedException("The submitted token is not valid/expired. Please try again");

        if(verified.purpose != "forgot-password") throw new UnauthorizedException("You’re not allowed to access this resource. Please check your account or contact support");

        const newPassword =  await this.passwordService.hashData(changePasswordCredentials.newPassword);

        const user = await this.prismaService.verifiedUser.update({
            where: {
                emailAddress: verified.emailAddress
            },
            data:{
                password: newPassword
            }
        });

        const mailOption = await this.mailService.mailOption({
                    emailAddress: user.emailAddress,
                    text: "Password Changed Successfully",
                    html: changePasswordEmail()
                });
        
        
        // TODO: Replace with BullMQ-based messaging service  
        // TODO: Add retry logic and queue management
        // Temporary message sending  
        await this.nodeMailerService.sendEmail(mailOption);

        return{
            success: true,
            message: "Password Changed Successfully"
        }
    }
}