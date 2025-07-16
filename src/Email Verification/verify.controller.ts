import { Body, Controller, Post, UseFilters, UseGuards } from "@nestjs/common";
import { VerifyEmailService } from "./verify.service";
import { VerifyDTO } from "./verify.dto";
import { RegistrationPrismaFilter } from "src/Exception/Filters/Prisma/registration.prisma.filter";
import { Throttle } from "@nestjs/throttler";
import { VerifyPrismaFilter } from "src/Exception/Filters/Prisma/verify.prisma.filter";
import { RequestRateLimiterGuard } from "src/Guards/Service/request.guard";


@Controller('security')
@UseFilters(new VerifyPrismaFilter())
@UseGuards(RequestRateLimiterGuard("verify",3, 60))
export class VerifyEmailController {
    constructor(private verifyEmailService: VerifyEmailService){}
    
    @Post('verify')
    async verify(@Body() verifyEmailDetails: VerifyDTO){
        return await this.verifyEmailService.verifyEmail(verifyEmailDetails);
    }
}