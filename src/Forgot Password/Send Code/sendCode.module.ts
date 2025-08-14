import { Module } from "@nestjs/common";
import { NodemailerModule } from "src/Common/Services/NodeMailer/nodemailer.module";
import { PrismaModule } from "src/Common/Services/Prisma/prisma.module";
import { CommonModule } from "src/Common/Services/Utils/common.module";
import { SendCodeService } from "./sendCode.service";
import { SendCodeController } from "./sendCode.controller";


@Module({
    imports: [CommonModule, PrismaModule, NodemailerModule],
    providers: [SendCodeService],
    controllers: [SendCodeController]
})
export class SendCodeModule {}