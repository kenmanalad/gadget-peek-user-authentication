import { Body, Controller, Post, UseFilters, UseGuards } from "@nestjs/common";
import { RegistrationService } from "./registration.service";
import { RegisterDTO } from "./register.dto";
import { RegistrationPrismaFilter } from "src/Common/Exception/Filters/Prisma/registration.prisma.filter";
import { RequestRateLimiterGuard } from "src/Common/Guards/request.guard";


@Controller("security")
@UseGuards(RequestRateLimiterGuard("registration", 2, 60))
@UseFilters(new RegistrationPrismaFilter())
export class RegistrationController{
    constructor(private registerService: RegistrationService){}

    @Post("register")
    async register(@Body() unverifiedUserDetails: RegisterDTO){
        return await this.registerService.manualRegister(unverifiedUserDetails);
    }

}