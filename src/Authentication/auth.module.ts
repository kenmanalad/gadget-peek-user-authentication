import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ConfigService } from "@nestjs/config";
import { PrismaModule } from "src/Prisma/prisma.module";
import { NodemailerModule } from "src/NodeMailer/nodemailer.module";
import { CommonModule } from "src/Common/common.module";

@Module({
    imports:[PrismaModule,NodemailerModule,CommonModule],
    providers:[AuthService],
    controllers:[AuthController]
})
export class AuthModule{}