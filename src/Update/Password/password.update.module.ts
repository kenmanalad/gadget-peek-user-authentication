import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Common/Services/Prisma/prisma.module";
import { CommonModule } from "src/Common/Services/Utils/common.module";
import { PasswordUpdateController } from "./password.update.controller";
import { PasswordUpdateService } from "./password.update.service";

@Module({
    imports: [CommonModule, PrismaModule],
    controllers: [PasswordUpdateController],
    providers: [PasswordUpdateService]
})
export class PasswordUpdateModule{}