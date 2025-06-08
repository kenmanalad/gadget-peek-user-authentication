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

                    //Stops the transaction before it moves forward
                    if(!unverifiedUser) return false;

                    if(unverifiedUser.code !== verifyEmailDetails.code) return false; 

                    const verifiedUser = await ts.verifiedUser.create({
                        data: {
                            emailAddress: unverifiedUser.emailAddress,
                            password: unverifiedUser.password,
                            userType: unverifiedUser.userType
                        }
                    });


                    //Stops transaction before deleting unverified user
                    if(!verifiedUser) return false;
                    
                    await ts.unverifiedUser.delete({
                        where:{
                            emailAddress: verifiedUser.emailAddress
                        }
                    });

                    return verifiedUser;
                    
                }
            );

            const mailOption = await this.mailService.mailOption({
                emailAddress: verifyEmailDetails.emailAddress,
                text: "Your account is verified",
                html: accountVerifiedEmail()
            });

            if(transaction){
                await this.nodeMailerService.sendEmail(mailOption);
            }
            
            if(!transaction){
                return {
                    success: false,
                    message: "Error: Failed to verify user, please contact an agent for assistance.",
                    status: 400
                }
            }
            return {
                    success: true,
                    message: "User successfully verified",
                    status: 200
            }

        }catch(error){
                return {
                            success: false,
                            message: "Error: Error occured while verifying user.",
                            status: 400
                        }
        }
    }
}