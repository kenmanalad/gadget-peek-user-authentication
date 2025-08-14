import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/Common/Services/Prisma/prisma.module";
import { CommonModule } from "src/Common/Services/Utils/common.module";
import { ForgotPasswordVerifyController } from "./forgot.verify.controller";
import { ForgotPasswordVerifyService } from "./forgot.verify.service";


@Module({
    imports:[CommonModule, PrismaModule],
    controllers: [ForgotPasswordVerifyController],
    providers:[ForgotPasswordVerifyService]
    
})
export class ForgotPasswordVerifyModule{}