import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Type } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { RedisService } from "src/Common/Services/Utils/redis.service";

export const RequestRateLimiterGuard = (purpose: string, limit: number, EX: number): Type<CanActivate> => {

    @Injectable()
    class RequestGuard implements CanActivate{
        constructor(private redisService: RedisService){}

        async canActivate(context: ExecutionContext): Promise<boolean> {
            const req = context.switchToHttp().getRequest<Request>();
            const ip =  req.ips.length ? req.ips[0] : req.ip

            if(!ip) throw new ForbiddenException('We could not identify your connection. Please try again later.');

            const key = `${purpose}:attempts:${ip}`;

            const isBlocked = await this.redisService.isBlocked(key, limit, EX);
            
            if (isBlocked) {
                throw new ForbiddenException(`Too many ${purpose} attempts. Please try again later.`);
            }

            return true;
        }

    }

    return RequestGuard;
}