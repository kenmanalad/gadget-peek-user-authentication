import { Injectable } from "@nestjs/common";
import { MailService } from "src/Common/Services/mail.service";
import { accountVerifiedEmail } from "src/Email Template/verified.template";
import { UnverifiedUserInterface, VerifyEmailInterface } from "src/Interface/interface.request";
import { BasicResponseInterface } from "src/Interface/interface.response";
import { NodeMailerService } from "src/NodeMailer/nodemailer.service";
import { PrismaService } from "src/Prisma/prisma.service";

@Injectable({})
export class VerifyEmailService {
    constructor(
            private prismaService: PrismaService,
            private nodeMailerService: NodeMailerService,
            private mailService: MailService
        ){}

    
    async verifyEmail(verifyEmailDetails: VerifyEmailInterface): Promise<BasicResponseInterface>{
        try{
            const transaction = await this.prismaService.$transaction(async(ts) => 
                {
                    const unverifiedUser = await ts.unverifiedUser.findUnique({
                        where: {
                            emailAddress: verifyEmailDetails.emailAddress
                        }
                    });

                    if(!unverifiedUser){
                        return {
                            success: false,
                            message: "Error: User must be registered first before verification.",
                            status: 400
                        }
                    };
                    if(unverifiedUser.code !== verifyEmailDetails.code){
                        return {
                            success: false,
                            message: "Error: Code does not match.",
                            status: 400
                        }
                    }

                    const verifiedUser = await ts.verifiedUser.create({
                        data: {
                            emailAddress: unverifiedUser.emailAddress,
                            password: unverifiedUser.password,
                            userType: unverifiedUser.userType
                        }
                    });


                    if(!verifiedUser){
                        return {
                            success: false,
                            message: "Error: Error occured while verifying user.",
                            status: 400,
                        }
                    };

                    return {
                        success: true,
                        message: "User successfully verified",
                        status: 200
                    }
                    
                }
            );

            const mailOption = await this.mailService.mailOption({
                emailAddress: verifyEmailDetails.emailAddress,
                text: "Your account is verified",
                html: accountVerifiedEmail()
            });

            if(transaction.success){
                await this.nodeMailerService.sendEmail(mailOption);
            }
            
            return transaction;

        }catch(error){
                return {
                            success: false,
                            message: "Error: Error occured while verifying user.",
                            status: 400
                        }
        }
    }
}