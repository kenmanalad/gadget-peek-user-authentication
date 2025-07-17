import { Controller, Delete, Param, ParseIntPipe, UseFilters, UseGuards } from "@nestjs/common";
import { Admin } from "src/Common/Decorators/admin.decorator";
import { AdminService } from "./admin.service";
import { AdminPrismaFilter } from "src/Common/Exception/Filters/Prisma/admin.prisma.filter";
import { RequestRateLimiterGuard } from "src/Common/Guards/Service/request.guard";

// This route is restricted to the Admin Service (or Central Admin Service) only.
// It should never be accessed externally or by unauthorized services.
// Ensure `AdminGuard` is always applied to enforce this restriction.
@Controller('admin')
@Admin()
@UseFilters(AdminPrismaFilter)
@UseGuards(RequestRateLimiterGuard('admin-delete-user',2, 60))
export class AdminController{
    constructor(
        private adminService: AdminService
    ){}
    @Delete('deleteUser/:id')
    async deleteUser(@Param('id', ParseIntPipe) id: number){
        return await this.adminService.deleteUserById(id);
    }
}