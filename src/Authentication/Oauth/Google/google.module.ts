import { Module } from "@nestjs/common";
import { CommonModule } from "src/Common/Services/common.module";
import { PrismaModule } from "src/Prisma/prisma.module";
import { GoogleService } from "./google.service";
import { GoogleController } from "./google.controller";
import { HttpModule } from "@nestjs/axios";


@Module({
    imports: [PrismaModule, CommonModule, HttpModule],
    providers: [GoogleService],
    controllers: [GoogleController]
})
export class GoogleModule{}