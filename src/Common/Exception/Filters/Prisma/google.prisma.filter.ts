import { ArgumentsHost, Catch, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { HttpException } from "@nestjs/common";
import { logger } from "src/Common/Services/Utils/logger";
import { HttpExceptionFilter } from "../http.exception.filter";
import { ConfigService } from "@nestjs/config";

@Catch(
    Prisma.PrismaClientInitializationError,
    Prisma.PrismaClientKnownRequestError,
    Prisma.PrismaClientUnknownRequestError,
    Prisma.PrismaClientRustPanicError,
    Prisma.PrismaClientValidationError,
    HttpException
)
export class GooglePrismaFilter extends HttpExceptionFilter{
    constructor(
        private configService:ConfigService
    ){
        super();
    }
    catch(exception: any, host: ArgumentsHost): void {
        const http = host.switchToHttp();
        const response = http.getResponse<Response>();
        const request = http.getRequest<Request>();

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

        if(!exception.code && exception instanceof HttpException){
            super.catch(exception, host)
            return;
        }

        logger.error({
            name: exception?.name ?? "UNKNOWN_ERROR_NAME",
            message: exception?.message ?? "We're unable to verify your Google account at the moment. Please try again later.",
            cause:  exception?.cause ?? "GOOGLE_PRISMA_ERROR",
            code: exception?.code ?? "NONE",
            path: request?.url,
        });

        switch(exception.code){
            case "P2020": 
            case "P2000": 
                responseObject("Some information retrieved from your Google profile is too long. Please try again with a different account.", HttpStatus.CONFLICT);
                break;
            
            case "P2002": 
                responseObject("This Google account is already registered. Please sign in instead.", HttpStatus.CONFLICT);
                break;

            case "P2003": 
            case "P2004": 
            case "P2006": 
            case "P2007": 
                responseObject("Invalid or missing data from your Google account. Please try again or use a different account.", HttpStatus.BAD_REQUEST);
                break;

            default:
                responseObject("We're unable to process your Google login at the moment. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
                break;
        }


    }

}