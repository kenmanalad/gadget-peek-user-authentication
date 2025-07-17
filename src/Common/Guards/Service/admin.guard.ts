import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import { logger } from "src/Common/Services/logger";

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
            const cookie = request.cookies['access_token'];

            let token = cookie;

            if(request.body.access_token && !cookie){
                token = request.body.access_token;
            }

            if(!token) throw new UnauthorizedException('Access Token not found');

            const verified = await this.jwtService.verifyAsync(token, {secret});

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