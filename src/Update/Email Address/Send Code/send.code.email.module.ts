import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Common/Services/Prisma/prisma.module";
import { CommonModule } from "src/Common/Services/Utils/common.module";
import { SendCodeUpdateEmailController } from "./send.code.email.controller";
import { SendCodeUpdateEmailService } from "./send.code.email.service";

@Module({
    imports: [PrismaModule, CommonModule],
    controllers: [SendCodeUpdateEmailController],
    providers: [SendCodeUpdateEmailService]
})
export class SendCodeUpdateEmailModule{}