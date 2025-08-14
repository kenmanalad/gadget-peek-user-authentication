import { Module } from "@nestjs/common";
import { VerifyEmailService } from "./verify.service";
import { VerifyEmailController } from "./verify.controller";
import { PrismaModule } from "src/Common/Services/Prisma/prisma.module";
import { NodemailerModule } from "src/Common/Services/NodeMailer/nodemailer.module";
import { CommonModule } from "src/Common/Services/Utils/common.module";

@Module({
    imports: [PrismaModule, NodemailerModule, CommonModule],
    providers:[VerifyEmailService],
    controllers:[VerifyEmailController]
})
export class VerifyEmailModule {}