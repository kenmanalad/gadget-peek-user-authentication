import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { HttpException } from "@nestjs/common";
import { logger } from "src/Common/Services/Utils/logger";

@Catch(
    HttpException
)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void {
        const http = host.switchToHttp();
        const response = http.getResponse<Response>();
        const request = http.getRequest<Request>();
        const status = exception.getStatus();


        let customMessage;

        switch (status) {
            case HttpStatus.BAD_REQUEST:
                customMessage = 'Invalid input. Please check your request.';
                break;
            case HttpStatus.UNAUTHORIZED:
                customMessage = 'You must be logged in to access this resource.';
                break;
            case HttpStatus.FORBIDDEN:
                customMessage = 'You do not have permission to perform this action.';
                break;
            case HttpStatus.NOT_FOUND:
                customMessage = 'The requested resource was not found.';
                break;
            case HttpStatus.FORBIDDEN:
                customMessage = 'You do not have permission to perform this action.';
                break;
            case HttpStatus.INTERNAL_SERVER_ERROR:
                customMessage = 'Something went wrong. Please try again later.';
                break;
            case HttpStatus.TOO_MANY_REQUESTS:
                customMessage = "Too many requests. Please try again later."
                break;
            default:
                customMessage = "We are experiencing a temporary error right now. Please contact an agent.";
        }

        logger.error({
                message: exception?.message ?? customMessage,
                cause: exception?.cause ?? "HTTP_ERROR",
                code: exception.code ?? "NONE",
                path: request?.url,
        });

        response.status(status).json({
                success: false,
                message: exception.message ?? customMessage
        })

    }
}