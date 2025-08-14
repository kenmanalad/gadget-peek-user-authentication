import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Common/Services/Prisma/prisma.module";
import { CommonModule } from "src/Common/Services/Utils/common.module";
import { ChangePasswordController } from "./change.password.controller";
import { ChangePasswordService } from "./change.password.service";
import { NodemailerModule } from "src/Common/Services/NodeMailer/nodemailer.module";

@Module({
    imports:[CommonModule, PrismaModule, NodemailerModule],
    controllers: [ChangePasswordController],
    providers: [ChangePasswordService]
})
export class ChangePasswordModule{}