import { Body, Controller, Post, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { RefreshTokenDTO } from "./refresh.dto";
import { RefreshService } from "./refresh.service";
import { RefreshTokenFilter } from "src/Common/Exception/Filters/refresh_token_filter";
import { Response, Request } from "express";
import { RefreshPrismaFilter } from "src/Common/Exception/Filters/Prisma/refresh.prisma.filter";
import { Throttle } from "@nestjs/throttler";
import { RequestRateLimiterGuard } from "src/Common/Guards/request.guard";

@Controller('security')
@UseGuards(RequestRateLimiterGuard("refresh",3, 60))
@UseFilters(new RefreshTokenFilter(), new RefreshPrismaFilter())
export class RefreshController{
    constructor(private refreshService: RefreshService){}

    @Post('refresh')
    async getAccessToken(
        @Res({passthrough: true}) response: Response, 
        @Req() request: Request)
        {
            const token = request.cookies["refresh_token"];
            const userAgent = (request.headers['user-agent'] ?? 'unknown').toString();
            return await this.refreshService.verifyRefreshToken(token, userAgent, response);
        }
}