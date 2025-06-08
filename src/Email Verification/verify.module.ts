import { Module } from "@nestjs/common";
import { VerifyEmailService } from "./verify.service";
import { VerifyEmailController } from "./verify.controller";
import { PrismaModule } from "src/Prisma/prisma.module";
import { NodemailerModule } from "src/NodeMailer/nodemailer.module";
import { CommonModule } from "src/Common/common.module";

@Module({
    imports: [PrismaModule, NodemailerModule, CommonModule],
    providers:[VerifyEmailService],
    controllers:[VerifyEmailController]
})
export class VerifyEmailModule {}