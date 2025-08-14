import { Body, Controller, Post, UseFilters, UseGuards } from "@nestjs/common";
import { SendCodeService } from "./sendCode.service";
import { SendCodeDTO } from "./sendCode.dto";
import { SendCodePrismaFilter } from "src/Common/Exception/Filters/Prisma/Forgot Password/sendCode.prisma.filter";
import { RequestRateLimiterGuard } from "src/Common/Guards/request.guard";


@Controller('security')
export class SendCodeController {
    constructor(private sendCodeService: SendCodeService){}

    @Post('forgot-password/send-code')
    @UseGuards(RequestRateLimiterGuard('send-code-forgot', 2, 60))
    @UseFilters(SendCodePrismaFilter)
    async sendCode(@Body() userCredentials: SendCodeDTO){
        return await this.sendCodeService.sendCode(userCredentials);
    }
}