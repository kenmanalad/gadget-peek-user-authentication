import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { CryptService } from "src/Common/Services/Utils/crypt.service";
import { PrismaService } from "src/Common/Services/Prisma/prisma.service";
import { DeactivateDTO } from "./deactivate.dto";
import { ConfigService } from "@nestjs/config";
import { MetaResponseService } from "src/Common/Services/Utils/meta.response.service";

@Injectable()
export class DeactivateService{
    constructor(
        private prismaService: PrismaService,
        private passwordService: CryptService,
        private metaService: MetaResponseService
    ){}

    private async confirmCredentials(userCredentials: DeactivateDTO){

        if(!userCredentials.isConfirmed) throw new BadRequestException(
            "Please confirm the deactivation of the account before submitting"
        );

        const user = await this.prismaService.verifiedUser.findUnique({
            where: {
                emailAddress: userCredentials.emailAddress
            }
        });

        if(!user || !user.password) throw new BadRequestException(
            "The submitted email address is not verified. Please try again."
        );

        const verified = await this.passwordService.verifyData(userCredentials.password, user.password);

        if(!verified) throw new BadRequestException(
            "The submitted password is not correct. Please try again."
        );

        return user;
    }
    async deactivateAccount(userCredentials: DeactivateDTO){

        const user = await this.confirmCredentials(userCredentials);

        await this.prismaService.$transaction(async(ts) => {
            await ts.verifiedUser.update({
                where: {
                    id: user.id
                },
                data: {
                    isActive: false
                }
            });

            await ts.refreshToken.deleteMany({
                where: {
                    userId: user.id
                }
            });
        });

        

        const meta = this.metaService.meta();
        return {
            success: true,
            message: "Account is deactivated",
            meta
        }


    }
}