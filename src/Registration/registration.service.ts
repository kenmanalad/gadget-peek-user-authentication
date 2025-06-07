import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { ManualUserDetailsInterface } from "src/Interface/interface.request";
import { BasicResponseInterface } from "src/Interface/interface.response";
import { NodeMailerService } from "src/NodeMailer/nodemailer.service";
import { ConfigService } from "@nestjs/config";
import { verificationEmail } from "src/Email Template/verify.email";
import { PasswordService } from "src/Common/Services/password.service";
@Injectable({})
export class RegistrationService {
    constructor(
        private prismaService: PrismaService,
        private nodeMailerService: NodeMailerService,
        private configService: ConfigService,
        private passwordService: PasswordService
    ){}
    async manualRegister(userDetails: ManualUserDetailsInterface): Promise<BasicResponseInterface>{
        try{
            //Code for email verification
            const code = Math.floor(100000 + Math.random() * 900000);
            const hashedPassword = await this.passwordService.hashPassword(userDetails.password);
            
            // Use Transaction
            const unverifiedUser = await this.prismaService.$transaction(
                async(ts) => {
                    const user = await ts.unverifiedUser.create({
                        data:{
                            emailAddress: userDetails.emailAddress,
                            password: hashedPassword,
                            code: code,
                            userType: userDetails.userType
                        }
                    });

                    return user;
                }
            );


            //To stop sending email verification if user is not saved
            if(!unverifiedUser) throw new Error("Error Occured");

             
            //Email Details for email verification
            let mailOption = {
                from: {
                    name: this.configService.get<string>("APP_NAME") || "GP",
                    address: this.configService.get<string>("GP_EMAIL_ADDRESS") || "GP"
                },
                to: userDetails.emailAddress,
                subject: `${this.configService.get<string>("APP_NAME") || "GP"} Email Verification`,
                text: `Your verification code is: ${code}`,
                html: verificationEmail(code)

            }

            const success = await this.nodeMailerService.sendEmail(mailOption);

            if(!success) throw new Error("Email not sent");

            return {
                success: true,
                message:"User Created Successfully",
                status:200
            }
        }catch(error){
            console.log(error);
            console.log("this is where the error occured");
            return {
                success: false,
                message:"User Failed to be Created",
                status:400
            }
        }
    }

    //Oauth registration function will be added soon for google and facebook
}