import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { JsonWebTokenError, TokenExpiredError } from "@nestjs/jwt";
import { Response } from "express";
import { logger } from "src/Common/Services/Utils/logger";
import { HttpStatus } from '@nestjs/common';
import { GaxiosError } from "gaxios";
import { HttpExceptionFilter } from "./http.exception.filter";
import { ConfigService } from "@nestjs/config";


@Catch(
    GaxiosError
)
export class GoogleAuthFilter extends HttpExceptionFilter {
    constructor(
        private configService: ConfigService
    ){
        super();
    }
     catch(exception: any, host: ArgumentsHost): void {
        const http = host.switchToHttp();
        const response = http.getResponse<Response>();
        const request = http.getRequest<Request>();

        if(exception instanceof HttpException){
            super.catch(exception, host);
            return;
        }

        const responseObject = (message: string, status: number) => {
            const apiVersion = this.configService.get<string>('API_VERSION') ?? 1.0;
            response.status(status).json({
                success: false,
                message: message, 
                meta: {
                    timestamp: new Date().toISOString(),
                    apiVersion   
                }
            })
        }

        logger.error({
            name: exception?.name ?? "UNKNOWN_ERROR_NAME",
            message: exception?.message ?? "We're unable to verify your Google account at the moment. Please try again later.",
            cause:  exception?.cause ?? "GOOGLE_AUTH_ERROR",
            code: HttpStatus.UNAUTHORIZED,
            path: request?.url,
        });

        switch (exception.message || exception.code) {

            case "invalid_grant":
                responseObject("The authorization code is invalid or has expired. Please try logging in again.", 401);
                break;

            case "unauthorized_client":
                responseObject("This app is not authorized to use Google Sign-In. Please contact support.", 403);
                break;

            case "invalid_client":
                responseObject("There is a configuration issue with the Google OAuth client. Please contact support.", 500);
                break;

            case "invalid_request":
                responseObject("The request to Google OAuth was malformed or missing parameters. Please try again.", 400);
                break;

            case "access_denied":
                responseObject("Access was denied by the user. Please authorize access to continue.", 403);
                break;

            case "unsupported_grant_type":
                responseObject("Unsupported grant type used in the OAuth request. Please contact support.", 400);
                break;

            default:
                responseObject("We're unable to verify your Google account at the moment. Please try again later.", 500);
                break;
        }

        
         
     }
     
}