import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { PrismaModule } from "src/Prisma/prisma.module";
import { CommonModule } from "src/Common/Services/common.module";

// This route is restricted to the Admin Service (or Central Admin Service) only.
// It should never be accessed externally or by unauthorized services.
// Ensure `AdminGuard` is always applied to enforce this restriction.
@Module({
    imports: [PrismaModule, CommonModule],
    providers: [AdminService],
    controllers:[AdminController]
})
export class AdminModule{}