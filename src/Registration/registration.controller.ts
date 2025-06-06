import { Controller, Post } from "@nestjs/common";
import { RegistrationService } from "./registration.service";

@Controller("security")
export class RegistrationController{
    constructor(private registerService: RegistrationService){}

    @Post("register")
    register(){
        return this.registerService.register();
    }

}