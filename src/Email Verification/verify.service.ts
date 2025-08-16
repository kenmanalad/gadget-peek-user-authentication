import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { MailService } from "src/Common/Services/Utils/mail.service";
import { accountVerifiedEmail } from "src/Email Template/verified.template";
import { BasicResponseInterface } from "src/Common/Interface/interface.response";
import { NodeMailerService } from "src/Common/Services/NodeMailer/nodemailer.service";
import { PrismaService } from "src/Common/Services/Prisma/prisma.service";
import { VerifyDTO } from "./verify.dto";
import { logger } from "src/Common/Services/Utils/logger";
import { ConfigService } from "@nestjs/config";
import { MetaResponseService } from "src/Common/Services/Utils/meta.response.service";

@Injectable({})
export class VerifyEmailService {
    constructor(
            private prismaService: PrismaService,
            private nodeMailerService: NodeMailerService,
            private mailService: MailService,
            private metaService: MetaResponseService
        ){}

    
    async verifyEmail(verifyEmailDetails: VerifyDTO){
        await this.prismaService.$transaction(async(ts) => 
                {
                    const unverifiedUser = await ts.unverifiedUser.findUnique({
                        where: {
                            emailAddress: verifyEmailDetails.emailAddress
                        }
                    });

                    if(!unverifiedUser) throw new BadRequestException('The email address is not yet registered. Please sign up first');

                    if(unverifiedUser.code !== verifyEmailDetails.code)  throw new UnauthorizedException('Invalid verification code. Please use the correct code.');

                    if(unverifiedUser.codeExpirationDate.getTime() < Date.now())  throw new UnauthorizedException('Expired verification code. Please try again.');

                    const verifiedUser = await ts.verifiedUser.create({
                        data: {
                            emailAddress: unverifiedUser.emailAddress,
                            password: unverifiedUser.password,
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
        

        const meta = this.metaService.meta();
        return {
                success: true,
                message: "User successfully verified",
                meta
        }
    }
}