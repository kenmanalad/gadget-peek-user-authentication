import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/Common/Services/Prisma/prisma.service";
import { ChangeEmailDTO } from "./change.email.dto";
import { logger } from "src/Common/Services/Utils/logger";

@Injectable()
export class ChangeEmailService{
    constructor(
        private prismaService: PrismaService
    ){}

    async changeEmailAddress(id: number, updateInfo: ChangeEmailDTO){
        const user = await this.prismaService.verifiedUser.findFirst({
            where: {
                id
            }
        });

        if(!user){
            logger.error({
                cause: "CHANGE_EMAIL_ADDRESS_ERROR_USER_NOT_FOUND",
                message: `User not found user-id:${id}.`
            });

            throw new InternalServerErrorException("Unable to locate your account information. Please contact an agent to resolve this issue.");
        }

        if(user.updateCode !== updateInfo.code){
            logger.error({
                cause: "CHANGE_EMAIL_ADDRESS_ERROR_CODE_MISMATCH",
                message: `Incorrect code:${updateInfo.code}.`
            });

            throw new BadRequestException("You submitted an incorrect code. Please submit the correct code.");
        }

        await this.prismaService.verifiedUser.update({
            where: {
                id
            },
            data: {
                emailAddress: updateInfo.newEmailAddress
            }
        });

        return {
            success: true,
            message: "Email address successfully updated."
        }
    }
}