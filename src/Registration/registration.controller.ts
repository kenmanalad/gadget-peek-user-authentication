import { Body, Controller, Post } from "@nestjs/common";
import { RegistrationService } from "./registration.service";
import { RegisterDTO } from "./register.dto";

@Controller("security")
export class RegistrationController{
    constructor(private registerService: RegistrationService){}

    @Post("register")
    async register(@Body() unverifiedUserDetails: RegisterDTO){
        //DTO handles the validating and transforming of the data
        if(unverifiedUserDetails.registerType === "oauth"){
            //still in planning phase
            // return await this.registerService.oauthRegister(unverifiedUserDetails);
            return {
                success: false,
                message: "Authentication using oauth/social platforms still developing"
            }
        }
        return await this.registerService.manualRegister(unverifiedUserDetails);
    }

}