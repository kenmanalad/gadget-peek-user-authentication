import { Body, Controller, Post, UseFilters, UseGuards } from "@nestjs/common";
import { VerifyCodePrismaFilter } from "src/Common/Exception/Filters/Prisma/Forgot Password/verifyCode.prisma.filter";
import { RequestRateLimiterGuard } from "src/Common/Guards/request.guard";
import { VerifyCodeDTO } from "./forgot.verify.dto";
import { ForgotPasswordVerifyService } from "./forgot.verify.service";
import { ForgotPasswordTokenFilter } from "src/Common/Exception/Filters/forgot.password.token.filter";

@Controller('security')
export class ForgotPasswordVerifyController{
    constructor(private forgotPasswordVerifyService: ForgotPasswordVerifyService){}
    @Post('forgot-password/verify-code')
    @UseGuards(RequestRateLimiterGuard("forgot-password-verify", 2, 60))
    @UseFilters(VerifyCodePrismaFilter, ForgotPasswordTokenFilter)
    async verifyCode(@Body() verifyCodeCredentials: VerifyCodeDTO){
        return await this.forgotPasswordVerifyService.verifyCode(verifyCodeCredentials);
    }
}