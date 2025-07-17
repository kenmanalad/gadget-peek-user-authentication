import { Body, Controller, Post, UseFilters, Res, Req, UseGuards } from "@nestjs/common";
import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./auth.dto";
import { AuthenticationPrismaFilter } from "src/Common/Exception/Filters/Prisma/authentication.prisma.filter";
import { RequestRateLimiterGuard } from "src/Common/Guards/Service/request.guard";

@Controller('security')
@UseGuards(RequestRateLimiterGuard("authentication", 5, 60))
@UseFilters(new AuthenticationPrismaFilter())
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('manual-auth')
    async SignIn(
        @Body() signInDetails: AuthDTO, 
        @Res({passthrough: true}) response: Response, 
        @Req() request: Request)
        {

            const userAgent = (request.headers['user-agent'] ?? 'unknown').toString();
            return await this.authService.manualSignin(signInDetails, response, userAgent);

        }
}