import { ArgumentsHost, Catch, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { HttpException } from "@nestjs/common";
import { HttpExceptionFilter } from "../http.exception.filter";
import { logger } from "src/Common/Services/Utils/logger";
import { ConfigService } from "@nestjs/config";

@Catch(
    Prisma.PrismaClientInitializationError,
    Prisma.PrismaClientKnownRequestError,
    Prisma.PrismaClientUnknownRequestError,
    Prisma.PrismaClientRustPanicError,
    Prisma.PrismaClientValidationError,
    HttpException
)
export class VerifyPrismaFilter extends HttpExceptionFilter{

    constructor(
        private configService: ConfigService
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
            super.catch(exception, host);
            return
        }

        logger.error({
                message: exception?.message ?? "We are experiencing a temporary error right now. Please contact an agent.",
                cause: exception?.cause ?? "EMAIL_VERIFICATION_ERROR",
                code: exception.code ?? "NONE",
                path: request?.url,
        });
        
        switch(exception.code){
            //Exceeding limit error types
            case "P2020":
            case "P2000":
                responseObject("The code you entered is too long. Please use the correct verification code.", HttpStatus.BAD_REQUEST);
                break

            //Invalid field error types
            case "P2003":
            case "P2004":
            case "P2006":
            case "P2007":
                responseObject("The code you entered is invalid. Please use the correct verification code type.", HttpStatus.BAD_REQUEST);
                break
            default:          
                responseObject("We are experiencing a temporary error right now. Please contact an agent.",HttpStatus.INTERNAL_SERVER_ERROR)
                break
            
        }


    }

}