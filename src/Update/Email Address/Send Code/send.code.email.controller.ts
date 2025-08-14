import { Body, Controller, Put, UseFilters, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/Common/Guards/JWT/jwt.guard";
import { RequestRateLimiterGuard } from "src/Common/Guards/request.guard";
import { SendCodeService } from "src/Forgot Password/Send Code/sendCode.service";
import { SendCodeUpdateEmailDTO } from "./send.code.email.dto";
import { SendCodeUpdateEmailService } from "./send.code.email.service";
import { SendCodePrismaFilter } from "src/Common/Exception/Filters/Prisma/Forgot Password/sendCode.prisma.filter";

@Controller('security')
@UseGuards(RequestRateLimiterGuard('send-code-update-email', 1, 60), JwtAuthGuard)
@UseFilters(SendCodePrismaFilter)
export class SendCodeUpdateEmailController{
    constructor(
        private sendCodeService: SendCodeUpdateEmailService
    ){}

    @Put('update/email/send-code')
    async sendCode(@Body() updateInfo: SendCodeUpdateEmailDTO){
        return await this.sendCodeService.sendVerificationCode(updateInfo.emailAddress);
    }
}