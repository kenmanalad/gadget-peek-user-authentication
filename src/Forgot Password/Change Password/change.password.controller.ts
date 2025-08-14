import { Body, Controller, Post, UseFilters, UseGuards } from "@nestjs/common";
import { ForgotPasswordTokenFilter } from "src/Common/Exception/Filters/forgot.password.token.filter";
import { ChangePasswordPrismaFilter } from "src/Common/Exception/Filters/Prisma/Forgot Password/changePassword.prisma.filter";
import { RequestRateLimiterGuard } from "src/Common/Guards/request.guard";
import { ChangePasswordDTO } from "./change.password.dto";
import { ChangePasswordService } from "./change.password.service";

@Controller('security')
export class ChangePasswordController{
    constructor(private changePasswordService: ChangePasswordService){}

    @Post('forgot-password/change-password')
    @UseGuards(RequestRateLimiterGuard("change-password", 2, 60))
    @UseFilters(ChangePasswordPrismaFilter, ForgotPasswordTokenFilter)
    async changePassword(@Body() changePasswordCredentials: ChangePasswordDTO){
        return await this.changePasswordService.changePassword(changePasswordCredentials);
    }
}