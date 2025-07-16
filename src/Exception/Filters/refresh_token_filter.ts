import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { JsonWebTokenError, TokenExpiredError } from "@nestjs/jwt";
import { Response } from "express";
import { logger } from "src/Common/Services/logger";
import { HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from "./http.exception.filter";
import { exceptions } from "winston";

@Catch(
    TokenExpiredError,
    JsonWebTokenError,
)
export class RefreshTokenFilter extends HttpExceptionFilter  {
     catch(exception: any, host: ArgumentsHost): void {
        const http = host.switchToHttp();
        const response = http.getResponse<Response>();
        const request = http.getRequest<Request>();

        let message: string;

        switch(exception.name){
            case "JsonWebTokenError":
                message = "Your session is invalid. Please log in.";
                break;
            case "TokenExpiredError":
                message = "Your session has expired. Please sign in again to continue";
                break;
            default:
                message = "We are experiencing a temporary error right now. Please contact an agent.";
                break;
        }

        logger.error({
            name: exception?.name ?? "UNKNOWN_ERROR_NAME",
            message: exception?.message ?? message,
            cause:  exception?.cause ?? "REFRESH_TOKEN_ERROR",
            code: HttpStatus.UNAUTHORIZED,
            path: request?.url,
        });

        response.status(HttpStatus.UNAUTHORIZED).json({
            success: false,
            message: message
        });


        
         
     }
     
}