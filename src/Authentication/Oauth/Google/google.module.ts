import { Module } from "@nestjs/common";
import { CommonModule } from "src/Common/common.module";
import { NodemailerModule } from "src/NodeMailer/nodemailer.module";
import { PrismaModule } from "src/Prisma/prisma.module";
import { GoogleService } from "./google.service";
import { GoogleController } from "./google.controller";
import { HttpModule } from "@nestjs/axios";
import { GoogleAuth } from "google-auth-library";


@Module({
    imports: [PrismaModule, CommonModule, HttpModule],
    providers: [GoogleService],
    controllers: [GoogleController]
})
export class GoogleModule{}