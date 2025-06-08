import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailOptionInterface } from "src/Interface/interface.request";

@Injectable({})
export class MailService {
    constructor(private configService: ConfigService){}

    async mailOption(mailDetails: MailOptionInterface){
        return {
                        from: {
                            name: this.configService.get<string>("APP_NAME") || "GP",
                            address: this.configService.get<string>("GP_EMAIL_ADDRESS") || "GP"
                        },
                        to: mailDetails.emailAddress,
                        subject: `${this.configService.get<string>("APP_NAME") || "GP"} Email Verification`,
                        text: mailDetails.text,
                        html: mailDetails.html
        
                    }
    }
}