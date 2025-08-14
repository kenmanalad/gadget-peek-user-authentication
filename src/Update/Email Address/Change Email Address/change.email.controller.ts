import { Body, Controller, Put, Req, UseFilters, UseGuards } from "@nestjs/common";
import { ChangePasswordPrismaFilter } from "src/Common/Exception/Filters/Prisma/Forgot Password/changePassword.prisma.filter";
import { JwtAuthGuard } from "src/Common/Guards/JWT/jwt.guard";
import { RequestRateLimiterGuard } from "src/Common/Guards/request.guard";
import { ChangeEmailService } from "./change.email.service";
import { ChangeEmailDTO } from "./change.email.dto";
import { Request } from "express";
import { RequestUserInterface } from "src/Common/Interface/interface.request";

@Controller('security')
@UseGuards(RequestRateLimiterGuard('change-email', 3, 60), JwtAuthGuard)
@UseFilters(ChangePasswordPrismaFilter)
export class ChangeEmailController{
    constructor(
        private changeEmailService: ChangeEmailService
    ){}

    @Put('update/email/change')
    async changeEmailAddress(@Req() request: Request,@Body() updateInfo: ChangeEmailDTO){
        const user = request.user as RequestUserInterface;

        return await this.changeEmailService.changeEmailAddress(user.sub, updateInfo);
    }
}