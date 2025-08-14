import { Module } from "@nestjs/common";
import { CommonModule } from "src/Common/Services/Utils/common.module";
import { PrismaModule } from "src/Common/Services/Prisma/prisma.module";
import { RefreshService } from "./refresh.service";
import { RefreshController } from "./refresh.controller";

@Module({
    imports:[PrismaModule, CommonModule],
    providers:[RefreshService],
    controllers:[RefreshController]
})
export class RefreshModule {}