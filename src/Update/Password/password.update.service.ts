import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/Common/Services/Prisma/prisma.service";
import { PasswordUpdateDTO } from "./password.update.dto";
import { CryptService } from "src/Common/Services/Utils/crypt.service";
import { logger } from "src/Common/Services/Utils/logger";
import { ConfigService } from "@nestjs/config";
import { MetaResponseService } from "src/Common/Services/Utils/meta.response.service";


@Injectable()
export class PasswordUpdateService{
    constructor(
        private prismaService: PrismaService,
        private passwordService: CryptService,
        private metaService: MetaResponseService
    ){}

    async updatePassword(id: number, updatePassword: PasswordUpdateDTO){
        const user = await this.prismaService.verifiedUser.findFirst({
            where: {
                id
            }
        });

        if(!user || !user.password){
            logger.error({
                cause: "UPDATE_PASSWORD_ERROR_MISSING_USER_INFO",
                message: "No registered/verified user was found."
            });

            throw new NotFoundException("We cannot locate information related to your user account. Please contact an agent to resolve this issue.");
        }

        const isValid = await this.passwordService.verifyData(updatePassword.oldPassword, user?.password);

        if(!isValid){
            logger.error({
                cause: "UPDATE_PASSWORD_ERROR_INCORRECT_PASSWORD",
                message: "The old password is incorrect."
            });
            throw new UnauthorizedException("You have submitted an incorrect password. Please submit your registered password.");
        }

        const password = await this.passwordService.hashData(updatePassword.newPassword);

        await this.prismaService.verifiedUser.update({
            where:{
                id
            },
            data:{
                password 
            }
        });

        const meta = this.metaService.meta();

        return {
            success: true,
            message: "Password successfully updated.",
            meta
        }
    }
}