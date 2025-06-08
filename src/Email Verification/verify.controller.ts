import { Body, Controller, Post } from "@nestjs/common";
import { VerifyEmailService } from "./verify.service";
import { VerifyDTO } from "./verify.dto";


@Controller('security')
export class VerifyEmailController {
    constructor(private verifyEmailService: VerifyEmailService){}
    
    @Post('verify')
    async verify(@Body() verifyEmailDetails: VerifyDTO){
        //Responses in cases of an error will be handled by the provider
        return await this.verifyEmailService.verifyEmail(verifyEmailDetails);
    }
}