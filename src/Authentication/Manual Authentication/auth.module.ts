import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "src/Common/Services/Prisma/prisma.module";
import { NodemailerModule } from "src/Common/Services/NodeMailer/nodemailer.module";
import { CommonModule } from "src/Common/Services/Utils/common.module";

@Module({
    imports:[PrismaModule,NodemailerModule,CommonModule],
    providers:[AuthService],
    controllers:[AuthController]
})
export class AuthModule{}