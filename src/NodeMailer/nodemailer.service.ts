import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import { EmailDetailsInterface } from "src/Interface/interface.request";
import { from, retry , lastValueFrom} from 'rxjs';
import { logger } from "../Common/Services/logger";


@Injectable({})
export class NodeMailerService{
    private transporter;
    constructor(private configService: ConfigService){

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
}