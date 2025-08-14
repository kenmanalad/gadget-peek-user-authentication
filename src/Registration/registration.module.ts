import { Module } from "@nestjs/common";
import { RegistrationController } from "./registration.controller";
import { RegistrationService } from "./registration.service";
import { PrismaModule } from "src/Common/Services/Prisma/prisma.module";
import { NodemailerModule } from "src/Common/Services/NodeMailer/nodemailer.module";
import { CommonModule } from "src/Common/Services/Utils/common.module";

@Module({
    imports:[PrismaModule,NodemailerModule,CommonModule],
    controllers:[RegistrationController],
    providers:[RegistrationService]
})
export class RegistrationModule {}