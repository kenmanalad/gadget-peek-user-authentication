import { ArgumentsHost, Catch, HttpException, HttpStatus } from "@nestjs/common";
import { HttpExceptionFilter } from "../http.exception.filter";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
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
export class AdminPrismaFilter extends HttpExceptionFilter{
    constructor(
        private configService: ConfigService
    ){
        super();
    }
    catch(exception: any, host: ArgumentsHost): void {
        const http = host.switchToHttp();
        const request = http.getRequest<Request>();
        const response = http.getResponse<Response>();

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
            message: exception?.message ?? "We are experiencing a temporary error right now. Please contact an agent.",
            cause: exception?.cause ?? "ADMIN_ERROR",
            code: exception.code ?? "NONE",
            path: request?.url,
        });

        switch (exception.code) {
            case 'P2025':
                responseObject("The user you're trying to delete or update does not exist.", HttpStatus.NOT_FOUND);
                break;

            case 'P2003':
                responseObject("Cannot delete this user because they are still referenced by other records.", HttpStatus.CONFLICT);
                break;

            case 'P2014':
                responseObject("Action blocked due to relational constraints. Please resolve related records first.", HttpStatus.CONFLICT);
                break;

            case 'P2000':
                responseObject("The value you entered is too long. Please shorten your input.", HttpStatus.BAD_REQUEST);
                break;

            case 'P2001':
                responseObject("A required field for updating the user is missing. Please check your input.", HttpStatus.BAD_REQUEST);
                break;

            case 'P2002':
                responseObject("This update would result in duplicate data. Please use a different value.", HttpStatus.CONFLICT);
                break;

            case 'P2010':   
                responseObject("There was an error retrieving the requested data. Please try again.", HttpStatus.BAD_REQUEST);
                break;
            case 'P2011':
                responseObject("A field required for update was null. Please provide all required data.", HttpStatus.BAD_REQUEST);
                break;
            case 'P2015':
                responseObject("Required data for this request is missing or mislinked.", HttpStatus.BAD_REQUEST);
                break;

            default:
                responseObject("An unexpected error occurred during the update or deletion process. Please try again or contact support.", HttpStatus.INTERNAL_SERVER_ERROR);
                break;
            }

    }
}