import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { JsonWebTokenError, TokenExpiredError } from "@nestjs/jwt";
import { Response } from "express";
import { logger } from "src/Common/Services/Utils/logger";
import { HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from "./http.exception.filter";
import { exceptions } from "winston";

@Catch(
    TokenExpiredError,
    JsonWebTokenError,
)
export class ForgotPasswordTokenFilter extends HttpExceptionFilter  {
     catch(exception: any, host: ArgumentsHost): void {
        const http = host.switchToHttp();
        const response = http.getResponse<Response>();
        const request = http.getRequest<Request>();

        let message: string;

        switch(exception.name){
            case "JsonWebTokenError":
                message = "Your token is invalid. Please repeat the process.";
                break;
            case "TokenExpiredError":
                message = "Your token has expired. Please repeat the process";
                break;
            default:
                message = "We are experiencing a temporary error right now. Please contact an agent.";
                break;
        }

        logger.error({
            name: exception?.name ?? "UNKNOWN_ERROR_NAME",
            message: exception?.message ?? message,
            cause:  exception?.cause ?? "FORGOT_PASSWORD_TOKEN_ERROR",
            code: HttpStatus.UNAUTHORIZED,
            path: request?.url,
        });

        response.status(HttpStatus.UNAUTHORIZED).json({
            success: false,
            message: message
        });


        
         
     }
     
}