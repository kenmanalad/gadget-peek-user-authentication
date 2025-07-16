import { BadRequestException, HttpStatus, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { ManualUserDetailsInterface } from "src/Interface/interface.request";
import { BasicResponseInterface } from "src/Interface/interface.response";
import { NodeMailerService } from "src/NodeMailer/nodemailer.service";
import { verificationEmail } from "src/Email Template/verify.email";
import { CryptService } from "src/Common/Services/crypt.service";
import { MailService } from "src/Common/Services/mail.service";
import { randomInt } from 'crypto';
@Injectable({})
export class RegistrationService {
    constructor(
        private prismaService: PrismaService,
        private nodeMailerService: NodeMailerService,
        private passwordService: CryptService,
        private mailService: MailService
    ){}
    private async sendVerificationCode(emailAddress: string, code: number){
        //Email Details for email verification
            const mailOption = await this.mailService.mailOption({
                emailAddress: emailAddress,
                text: `Your verification code is: ${code}`,
                html: verificationEmail(code)
            })


            // TODO: Temporary message sending  
            // TODO: Replace with BullMQ-based messaging service  
            // TODO: Add retry logic and queue management

            //Multiple retries
            const success = await this.nodeMailerService.sendEmail(mailOption);

            if(!success) {
                await this.prismaService.unverifiedUser.delete({
                    where: {
                        emailAddress: emailAddress
                    }
                });
                throw new UnprocessableEntityException('Verification code could not be sent to the email address.',
                    {
                        cause: "Mailing error: Verification code dispatch failed."
                    }
                );
            };
    }
    async manualRegister(userDetails: ManualUserDetailsInterface): Promise<BasicResponseInterface>{

            const code = randomInt(100000, 1000000);
            const hashedPassword = await this.passwordService.hashData(userDetails.password);
            
            
            await this.prismaService.unverifiedUser.create({
                        data:{
                            emailAddress: userDetails.emailAddress,
                            password: hashedPassword,
                            code: code,
                            userType: userDetails.userType
                        }
                    });


            await this.sendVerificationCode(userDetails.emailAddress, code);


            return {
                success: true,
                message:"User Created Successfully",
                status: HttpStatus.OK
            }
    }
}