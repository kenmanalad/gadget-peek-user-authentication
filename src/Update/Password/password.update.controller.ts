import { Body, Controller, Put, Req, UseFilters, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/Common/Guards/JWT/jwt.guard";
import { RequestRateLimiterGuard } from "src/Common/Guards/request.guard";
import { PasswordUpdateService } from "./password.update.service";
import { PasswordUpdateDTO } from "./password.update.dto";
import { Request } from "express";
import { RequestUserInterface } from "src/Common/Interface/interface.request";
import { ChangePasswordPrismaFilter } from "src/Common/Exception/Filters/Prisma/Forgot Password/changePassword.prisma.filter";

@Controller('security')
@UseGuards(RequestRateLimiterGuard('update-password', 1, 60), JwtAuthGuard)
@UseFilters(ChangePasswordPrismaFilter)
export class PasswordUpdateController{
    constructor(
        private passwordUpdateService: PasswordUpdateService
    ){}

    @Put('update/password')
    async updatePassword(@Req() request: Request,@Body() updatePassword: PasswordUpdateDTO){
        const user = request.user as RequestUserInterface;
        return await this.passwordUpdateService.updatePassword(user.sub, updatePassword);
    }
}