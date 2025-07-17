import { Module } from "@nestjs/common";
import { CommonModule } from "src/Common/Services/common.module";
import { PrismaModule } from "src/Prisma/prisma.module";
import { DeactivateService } from "./deactivate.service";
import { DeactivateController } from "./deactivate.controller";

@Module(
    {
        imports: [PrismaModule, CommonModule],
        providers:[DeactivateService],
        controllers:[DeactivateController]
    }
)
export class DeactivateModule{}