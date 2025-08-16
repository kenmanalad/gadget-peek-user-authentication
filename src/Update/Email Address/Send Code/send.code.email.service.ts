import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomInt } from "crypto";
import { NodeMailerService } from "src/Common/Services/NodeMailer/nodemailer.service";
import { PrismaService } from "src/Common/Services/Prisma/prisma.service";
import { logger } from "src/Common/Services/Utils/logger";
import { MailService } from "src/Common/Services/Utils/mail.service";
import { MetaResponseService } from "src/Common/Services/Utils/meta.response.service";
import { verificationEmail } from "src/Email Template/verify.email";

@Injectable()
export class SendCodeUpdateEmailService{
    constructor(
        private nodeMailerService: NodeMailerService,
        private mailService: MailService, 
        private prismaService: PrismaService,
        private metaService: MetaResponseService
    ){}

    async sendVerificationCode(emailAddress: string){
        //Email Details for email verification
        const code = randomInt(100000, 1000000);
        const mailOption = await this.mailService.mailOption({
            emailAddress: emailAddress,
            text: `Your verification code is: ${code}`,
            html: verificationEmail(code)
        })


        // TODO: Temporary message sending  
        // TODO: Replace with BullMQ-based messaging service  
        // TODO: Add retry logic and queue management

        //Multiple retries
        const user = await this.prismaService.verifiedUser.update({
            where: {
                emailAddress,
            },
            data: {
                updateCode: code
            }
        });

        if(!user){
            logger.error({
                cause:"SEND_CODE_UPDATE_ERROR_USER_NOT_FOUND",
                message: "User not found"
            });
            throw new BadRequestException("You submitted an incorrect credential. Please submit a registered email address.");
        }

        const success = await this.nodeMailerService.sendEmail(mailOption);

        if(!success) {
            logger.error({
                cause: "UPDATE_EMAIL_ERROR_MAIL_FAILURE",
                message: "Failed to send verification code."
            });

            throw new InternalServerErrorException("We are experiencing a temporary issue right now. Please try again later.");
        };



        const meta = this.metaService.meta()
        return {
            success: true,
            message: "Verification code sent successfully.",
            meta
        }
    }
}