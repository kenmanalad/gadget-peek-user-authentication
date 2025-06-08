import { Body, Controller, Post } from "@nestjs/common";
import { RegistrationService } from "./registration.service";
import { RegisterDTO } from "./register.dto";

@Controller("security")
export class RegistrationController{
    constructor(private registerService: RegistrationService){}

    @Post("register")
    async register(@Body() unverifiedUserDetails: RegisterDTO){
        return await this.registerService.manualRegister(unverifiedUserDetails);
    }

}