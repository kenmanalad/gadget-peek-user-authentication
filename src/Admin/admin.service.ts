import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { logger } from "src/Common/Services/Utils/logger";
import { PrismaService } from "src/Common/Services/Prisma/prisma.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AdminService{
    private apiVersion: number;
    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService
    ){
        this.apiVersion = this.configService.get<number>('API_VERSION') ?? 1.0;
    }
    private async findUserById(id: number){
        const user = await this.prismaService.verifiedUser.findUnique({
                where: {id}
            });
        
        if(!user) throw new NotFoundException('User not found. Please provide the right id number');

        return user;
    }



    async deactivateUserById(id: number){
        const deactivatedUser = await this.findUserById(id);

        await this.prismaService.$transaction(async(ts) => {

            await ts.refreshToken.deleteMany({
                where: {
                    userId: deactivatedUser.id
                }
            });

            await ts.verifiedUser.update({
                data:{
                    isActive: false
                },
                where: {
                    id: deactivatedUser.id
                }
            });
        });

        logger.info({
            message: `User with id number ${id} is deactivated`,
            email: deactivatedUser.emailAddress,
            id: deactivatedUser.id,
            createdAt: deactivatedUser.createdAt,
        });

        return{
            success: true,
            message: `User with id number ${id}, email address ${deactivatedUser.emailAddress} is deactivated`,
            meta: {
                timestamp: new Date().toISOString(),
                apiVersion: this.apiVersion
            }
        }
    }

    async changeUserTypeToSeller(id: number){
        const user = await this.prismaService.verifiedUser.update({
            where: {
                id
            },
            data:{
                role: "seller"
            }
        });


        logger.info({
            message: `User with id number ${id} is upgraded into a seller`,
            email: user.emailAddress,
            id: user.id,
            createdAt: user.createdAt,
        });

        return{
            success: true,
            message: `User with id number ${id}, email address ${user.emailAddress} is successfully upgraded into a seller.`,
            meta: {
                timestamp: new Date().toISOString(),
                apiVersion: this.apiVersion
            }
        }
    }
}