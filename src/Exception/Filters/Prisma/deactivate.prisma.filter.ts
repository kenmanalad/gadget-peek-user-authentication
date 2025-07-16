import { ArgumentsHost, Catch, HttpException, HttpStatus } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { HttpExceptionFilter } from "../http.exception.filter";
import { Request, Response } from "express";
import { logger } from "src/Common/Services/logger";

@Catch(
    Prisma.PrismaClientInitializationError,
    Prisma.PrismaClientKnownRequestError,
    Prisma.PrismaClientUnknownRequestError,
    Prisma.PrismaClientRustPanicError,
    Prisma.PrismaClientValidationError,
    HttpException
)
export class DeactivatePrismaFilter extends HttpExceptionFilter{
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


        if(!exception.code || exception instanceof HttpException){
            super.catch(exception,host);
            return;
        }

        logger.error({
            message: exception?.message ?? "We are experiencing a temporary error right now. Please contact an agent.",
            cause: exception?.cause ?? "DEACTIVATE_ERROR",
            code: exception.code ?? "NONE",
            path: request?.url,
        });

        switch(exception.code){
            case "P2001":
            case "P2025": 
                responseObject("Some of the information appears to be missing. Please contact an agent to assist you.", HttpStatus.NOT_FOUND);
                break;
            
            case "P2003": 
                responseObject("There is a problem deactivating your account. Please contact an agent to assist you.", HttpStatus.CONFLICT);
                break;

            default:
                responseObject("We're unable to process your Google login at the moment. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
                break;
        }
    }
}