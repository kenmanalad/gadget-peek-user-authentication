import { Module } from "@nestjs/common";
import { RegistrationController } from "./registration.controller";
import { RegistrationService } from "./registration.service";
import { PrismaModule } from "src/Prisma/prisma.module";
import { NodemailerModule } from "src/NodeMailer/nodemailer.module";
import { CommonModule } from "src/Common/common.module";

@Module({
    imports:[PrismaModule,NodemailerModule,CommonModule],
    controllers:[RegistrationController],
    providers:[RegistrationService]
})
export class RegistrationModule {}