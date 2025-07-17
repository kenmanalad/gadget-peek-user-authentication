import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { logger } from "src/Common/Services/logger";
import { PrismaService } from "src/Prisma/prisma.service";

@Injectable()
export class AdminService{
    constructor(
        private prismaService: PrismaService
    ){}
    private async findUserById(id: number){
        const user = await this.prismaService.verifiedUser.findUnique({
                where: {id}
            });
        
        if(!user) throw new NotFoundException('User not found. Please provide the right id number');

        return user;
    }


    async deleteUserById(id: number){
        const deletedUser = await this.findUserById(id);

        await this.prismaService.$transaction(async(ts) => {

            await ts.refreshToken.deleteMany({
                where: {
                    userId: deletedUser.id
                }
            });

            await ts.verifiedUser.delete({
                where: {
                    id: deletedUser.id
                }
            });
        });

        logger.info({
            message: `User with id number ${id} is deleted`,
            email: deletedUser.emailAddress,
            id: deletedUser.id,
            createdAt: deletedUser.createdAt,
        });

        return{
            success: true,
            message: 'User account is deleted'
        }
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
            message: 'User account is deactivated'
        }
    }

    async changeUserRoleById(id: number){
        const updatedUser = await this.prismaService.verifiedUser.update({
            data: {
                userType: "seller"
            },
            where: {id}
        }); 

        logger.info({
            message: `User with id number ${id} is upgraded into a seller`,
            email: updatedUser.emailAddress,
            id: updatedUser.id,
            createdAt: updatedUser.createdAt,
        });

        return{
            success: true,
            message: 'User account is upgraded into a seller'
        }


    }
}