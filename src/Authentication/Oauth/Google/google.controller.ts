import { Body, Controller, Get, Post, Query, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { GoogleService } from "./google.service";
import { GoogleDTO } from "./google.dto";
import { Request, Response } from "express";
import { GooglePrismaFilter } from "src/Common/Exception/Filters/Prisma/google.prisma.filter";
import { GoogleAuthFilter } from "src/Common/Exception/Filters/google.auth.filter";
import { RequestRateLimiterGuard } from "src/Common/Guards/request.guard";

@Controller('security')
@UseFilters(new GooglePrismaFilter(), new GoogleAuthFilter())
@UseGuards(RequestRateLimiterGuard("googleAuth", 5, 60))
export class GoogleController {
    // This endpoint accepts the authorization code provided by the client.
    // The client is responsible for generating the Google OAuth URL and handling the user consent flow,
    // including retrieving the code from the redirect URL after successful authorization.
    constructor(private googleService: GoogleService){}

    @Post('google-oauth')
    async getAuthTokens(
        @Body() googleAuth: GoogleDTO, 
        @Res({passthrough: true}) response: Response,
        @Req() request: Request
    ){
        const userAgent = (request.headers['user-agent'] ?? 'unknown').toString();
        return await this.googleService.googleAuth(googleAuth, response, userAgent);
    }

}