import { ArgumentsHost, Catch, HttpException, HttpStatus } from "@nestjs/common";
import { HttpExceptionFilter } from "../../http.exception.filter";
import { Prisma } from "@prisma/client";
import { logger } from "src/Common/Services/Utils/logger";
import { Request, Response } from "express";

@Catch(
    Prisma.PrismaClientInitializationError,
    Prisma.PrismaClientKnownRequestError,
    Prisma.PrismaClientUnknownRequestError,
    Prisma.PrismaClientRustPanicError,
    Prisma.PrismaClientValidationError,
    HttpException
)
export class ChangePasswordPrismaFilter extends HttpExceptionFilter{
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
                    cause: exception?.cause ?? "CHANGE_PASSWORD_ERROR",
                    code: exception.code ?? "NONE",
                    path: request?.url,
            });
            
            switch(exception.code){
                //Exceeding limit error types
                case "P2025":
                    responseObject("The account your trying to update does not exist. Please try again.",HttpStatus.NOT_FOUND);
                    break
    
                //Invalid field error types
                case "P2019":
                    responseObject("The information you submitted does not match the required input. Please try again.", HttpStatus.BAD_REQUEST);
                    break

                case "P2011":
                    responseObject("Required information is missing. Please submit the information.", HttpStatus.BAD_REQUEST);
                    break

                
                default:          
                    responseObject("We are experiencing a temporary error right now. Please contact an agent.",HttpStatus.INTERNAL_SERVER_ERROR)
                    break
                
            }
    }
}