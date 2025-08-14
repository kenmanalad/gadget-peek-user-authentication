import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { logger } from "src/Common/Services/Utils/logger";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect();
        logger.info('Program is Connected to the database');
    }
    async onModuleDestroy() {
        await this.$disconnect();
        logger.info('Program is disconnected from the database');
    }

    async findOrCreateUser(emailAddress: string){
        try{
            const user = await this.verifiedUser.findUnique({
                where: {
                    emailAddress
                }
            });

            if(!user){
                const newUser = await this.verifiedUser.create({
                    data:{
                        emailAddress
                    }
                });
                return {
                    success: true,
                    message: "User successfully created",
                    user: newUser
                };
            }

            return {
                success: true,
                message: "User successfully found",
                user: user
            };

        }catch(error){
            let message;
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                switch(error.code){
                    case "P2002":
                        message = "The email address you entered is already in use. Please use a different one or try signing in instead.";
                        break;
                    case "P2000":
                    case "P2020":
                        message = "The information you provided is outside the allowed range. Please check your input and try again.";
                        break;
                    case "P2006":
                        message = "The email address you entered appears to be invalid. Please double-check it and try again.";
                        break;
                    default:
                        message =  "We are experiencing a temporary error right now. Please contact an agent.";
                        break;
                }
            }

            logger.error({
                message: message,
                cause: "FIND_OR_CREATE_ERROR",
                error: error 
            });

            return {
                success: false,
                message: message ?? "We are experiencing a temporary error right now. Please contact an agent.",
                user: null
            };
        }
    }
}