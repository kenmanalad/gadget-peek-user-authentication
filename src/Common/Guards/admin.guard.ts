import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { logger } from "src/Common/Services/Utils/logger";

@Injectable()
export class AdminGuard implements CanActivate{
    constructor(
        private readonly reflector: Reflector,
        private jwtService: JwtService,
        private configService: ConfigService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        
        try{

            const admin = this.reflector.get<string>('admin', context.getHandler());
            const secret = this.configService.get<string>('ADMIN_SECRET');
            const token = request.cookies['access_token'];

            if(!token) {
                logger.error({
                    cause: "ADMIN_VERIFICATION_ERROR_MISSING_TOKEN",
                    message: "Access token is missing",
                });
                throw new UnauthorizedException('Access Token not found');
            }


            const verified = await this.jwtService.verifyAsync(token, {secret});

            if(!verified){
                logger.error({
                    cause: "ADMIN_VERIFICATION_ERROR",
                    message: "Unverified entity is trying to access admin services."
                });

                throw new UnauthorizedException("You are not a verified administrator. Please refrain from accessing this service.");
            }

            if(!admin || admin !== verified.role) throw new UnauthorizedException('Only the admin is allowed here');

            return true;
            
        }catch(error){
            logger.error({
                message: error?.message ?? "Admin access required",
                error: error,
                path: request.url,
                userAgent: request.headers['user-agent'],
                method: request.method
            });
            throw new UnauthorizedException('Access denied: invalid or missing admin token');
        }
    }
}