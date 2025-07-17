import { BadRequestException, Injectable } from "@nestjs/common";
import { logger } from "src/Common/Services/logger";
import { PrismaService } from "src/Prisma/prisma.service";

@Injectable()
export class AdminService{
    constructor(
        private prismService: PrismaService
    ){}
    async deleteUserById(id: number){
        const deletedUser = await this.prismService.$transaction(async(ts) => {
            const user = await ts.verifiedUser.findUnique({
                where: {id}
            });

            if(!user) throw new BadRequestException('User not found. Please provide the right id number');

            await ts.refreshToken.deleteMany({
                where: {
                    userId: user.id
                }
            });

            await ts.verifiedUser.delete({
                where: {
                    id: user.id
                }
            });
            return user;
        });

        logger.info({
            message: `User with id number ${id} is deleted`,
            email: deletedUser.emailAddress,
            createdAt: deletedUser.createdAt,
        });

        return{
            sucess: true,
            message: 'User account is deleted'
        }
    }
}