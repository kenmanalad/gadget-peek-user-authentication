import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { MailService } from "src/Common/Services/mail.service";
import { accountVerifiedEmail } from "src/Email Template/verified.template";
import { BasicResponseInterface } from "src/Interface/interface.response";
import { NodeMailerService } from "src/NodeMailer/nodemailer.service";
import { PrismaService } from "src/Prisma/prisma.service";
import { VerifyDTO } from "./verify.dto";
import { logger } from "src/Common/Services/logger";

@Injectable({})
export class VerifyEmailService {
    constructor(
            private prismaService: PrismaService,
            private nodeMailerService: NodeMailerService,
            private mailService: MailService
        ){}

    
    async verifyEmail(verifyEmailDetails: VerifyDTO): Promise<BasicResponseInterface>{
        await this.prismaService.$transaction(async(ts) => 
                {
                    const unverifiedUser = await ts.unverifiedUser.findUnique({
                        where: {
                            emailAddress: verifyEmailDetails.emailAddress
                        }
                    });

                    if(!unverifiedUser) throw new BadRequestException('The email address is not yet registered. Please sign up first');

                    if(unverifiedUser.code !== verifyEmailDetails.code)  throw new UnauthorizedException('Invalid verification code');

                    const verifiedUser = await ts.verifiedUser.create({
                        data: {
                            emailAddress: unverifiedUser.emailAddress,
                            password: unverifiedUser.password,
                            userType: unverifiedUser.userType
                        }
                    });
                    
                    await ts.unverifiedUser.delete({
                        where:{
                            emailAddress: verifiedUser.emailAddress
                        }
                    });
                    
                }
        );

        const mailOption = await this.mailService.mailOption({
            emailAddress: verifyEmailDetails.emailAddress,
            text: "Your account is verified",
            html: accountVerifiedEmail()
        });


        // TODO: Replace with BullMQ-based messaging service  
        // TODO: Add retry logic and queue management
        // Temporary message sending  
        await this.nodeMailerService.sendEmail(mailOption);
        

        return {
                success: true,
                message: "User successfully verified",
                status: 200
        }
    }
}