import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import { EmailDetailsInterface } from "src/Interface/interface.request";


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
        console.log('this is where the mailing starts');
        const response = await this.transporter.sendMail(emailDetails);
        console.log('this is where the mailing ends');

        if(response.rejected.length > 0) throw new Error("Failed to send the email.");

        return true;

    }
}