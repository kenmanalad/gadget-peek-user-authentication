import { Injectable, ServiceUnavailableException, UnprocessableEntityException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import { EmailDetailsInterface } from "src/Common/Interface/interface.request";
import { from, retry , lastValueFrom} from 'rxjs';
import { logger } from "../Utils/logger";
import { MailService } from "../Utils/mail.service";


@Injectable({})
export class NodeMailerService{
    private transporter;
    constructor(
        private configService: ConfigService,
        private mailService: MailService

    ){

        this.transporter = nodemailer.createTransport(
            {
                service: this.configService.get<string>('TRANSPORTER_SERVICE'),
                host: this.configService.get<string>('TRANSPORTER_HOST'),
                port: this.configService.get<number>('TRANSPORTER_PORT'), 
                auth: 
                    {
                        user: this.configService.get<string>('GP_EMAIL_ADDRESS'), 
                        pass: this.configService.get<string>('GP_PASSWORD'),
                    },
            }
        );
    }
    
    async sendEmail(emailDetails: EmailDetailsInterface) :Promise<boolean>{
        try{
            await lastValueFrom(
                from(
                    this.transporter.sendMail(emailDetails)).pipe(retry({ count: 5, delay: 3000}                        
                    )
                )
            );
            return true;
        }catch(error){
            logger.error(
                {
                    message: error.message ?? `Failed to send verification code to`,
                    to: emailDetails.to,
                    from: emailDetails.from,
                    cause: "MAIL_ERROR",
                    error: error
                }
            );
            return false;
            
        }


    }

    async sendCode(emailAddress: string, code: number, purpose: string, htmlFormat: string){
        //Email Details for email verification
            const mailOption = await this.mailService.mailOption({
                emailAddress: emailAddress,
                text: `Your ${purpose} is: ${code}`,
                html: htmlFormat
            })


            // TODO: Temporary message sending  
            // TODO: Replace with BullMQ-based messaging service  
            // TODO: Add retry logic and queue management

            //Multiple retries
            const success = await this.sendEmail(mailOption);

            if(!success) {
                throw new ServiceUnavailableException(`${purpose} could not be sent to the email address.`,
                    {
                        cause: `Mailing error: ${purpose} dispatch failed.`
                    }
                );
            };
    }
    
}