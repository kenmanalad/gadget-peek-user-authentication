import { ArgumentsHost, Catch, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { HttpException } from "@nestjs/common";
import { HttpExceptionFilter } from "../http.exception.filter";
import { logger } from "src/Common/Services/Utils/logger";

@Catch(
    Prisma.PrismaClientInitializationError,
    Prisma.PrismaClientKnownRequestError,
    Prisma.PrismaClientUnknownRequestError,
    Prisma.PrismaClientRustPanicError,
    Prisma.PrismaClientValidationError,
    HttpException
)
export class RegistrationPrismaFilter extends HttpExceptionFilter{
    catch(exception: any, host: ArgumentsHost): void {
        const http = host.switchToHttp();
        const response = http.getResponse<Response>();
        const request = http.getRequest<Request>();

        const responseObject = (message: string, status: number) => {
            response.status(status).json({
                success: false,
                message: message
            })
        }

        if(!exception.code && exception instanceof HttpException){
            super.catch(exception, host);
            return
        }

        logger.error({
                message: exception?.message ?? "We are experiencing a temporary error right now. Please contact an agent.",
                cause: exception?.cause ?? "REGISTRATION_ERROR",
                code: exception.code ?? "NONE",
                path: request?.url,
        });
        
        switch(exception.code){
            //Exceeding limit error types
            case "P2020":
            case "P2000":
                responseObject("The information you entered is too long. Please shorten it and register again.", HttpStatus.BAD_REQUEST);
                break
            
            case "P2002":
                responseObject("The email address is already registered/verified", HttpStatus.CONFLICT);
                break

            //Invalid field error types
            case "P2003":
            case "P2004":
            case "P2006":
            case "P2007":
                responseObject("One or more fields contain invalid values. Please review your input.", HttpStatus.BAD_REQUEST);
                break
            default:          
                responseObject("We are experiencing a temporary error right now. Please contact an agent.",HttpStatus.INTERNAL_SERVER_ERROR)
                break
            
        }


    }

}