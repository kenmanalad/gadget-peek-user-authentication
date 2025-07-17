import { Body, Controller, Post, Req, Res, UseFilters } from "@nestjs/common";
import { RefreshTokenDTO } from "./refresh.dto";
import { RefreshService } from "./refresh.service";
import { RefreshTokenFilter } from "src/Common/Exception/Filters/refresh_token_filter";
import { Response, Request } from "express";
import { RefreshPrismaFilter } from "src/Common/Exception/Filters/Prisma/refresh.prisma.filter";
import { Throttle } from "@nestjs/throttler";

@Controller('security')
@UseFilters(new RefreshTokenFilter(), new RefreshPrismaFilter())
export class RefreshController{
    constructor(private refreshService: RefreshService){}

    @Post('refresh')
    @Throttle({ default: { limit: 2, ttl: 60000}})
    async getAccessToken(
        @Body() refreshToken: RefreshTokenDTO, 
        @Res({passthrough: true}) response: Response, 
        @Req() request: Request)
        {
            const userAgent = (request.headers['user-agent'] ?? 'unknown').toString();
            return await this.refreshService.verifyRefreshToken(refreshToken, userAgent, response);
        }
}