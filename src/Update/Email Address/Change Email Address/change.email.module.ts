import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Common/Services/Prisma/prisma.module";
import { CommonModule } from "src/Common/Services/Utils/common.module";
import { ChangeEmailController } from "./change.email.controller";
import { ChangeEmailService } from "./change.email.service";

@Module({
    imports: [PrismaModule, CommonModule],
    controllers: [ChangeEmailController],
    providers: [ChangeEmailService]
})
export class ChangeEmailModule{}