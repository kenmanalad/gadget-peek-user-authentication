import { Body, Controller, Post } from "@nestjs/common";
import { VerifyEmailService } from "./verify.service";
import { VerifyEmailInterface } from "src/Interface/interface.request";


@Controller('verify')
export class VerifyEmailController {
    constructor(private verifyEmailService: VerifyEmailService){}
    
    @Post()
    async verify(@Body() verifyEmailDetails: VerifyEmailInterface){
        //Responses in cases of an error will be handled by the provider
        return await this.verifyEmailService.verifyEmail(verifyEmailDetails);
    }
}