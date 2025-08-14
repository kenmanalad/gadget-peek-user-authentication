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
export class AuthenticationPrismaFilter extends HttpExceptionFilter {
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


        logger.error({
                message: exception?.message ?? "We are experiencing a temporary error right now. Please contact an agent.",
                cause: exception?.cause ?? "AUTHENTICATION_ERROR",
                code: exception.code ?? "NONE",
                path: request?.url,
        });

        if(!exception.code){
            super.catch(exception,host)
            return;
        };

        switch(exception.code){
            //Exceeding limit error types
            case "P2020":
            case "P2000":
                responseObject("The sign-in information you entered is too long. Please enter valid credentials.", HttpStatus.CONFLICT);
                break
            
            case "P2025":
                responseObject("We couldn't find an account with that email. Try signing up first.",HttpStatus.NOT_FOUND);
                break

            //Invalid field error types
            case "P2003":
            case "P2004":
            case "P2006":
            case "P2007":
                responseObject("The email address or password is invalid. Please check your input.", HttpStatus.BAD_REQUEST);
                break
            default:          
                responseObject("We are experiencing a temporary error right now. Please contact an agent.",HttpStatus.INTERNAL_SERVER_ERROR)
                break
            
        }

        
    }
}