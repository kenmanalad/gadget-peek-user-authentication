import { Controller, Delete, Param, ParseIntPipe, Post, UseFilters, UseGuards } from "@nestjs/common";
import { Admin } from "src/Common/Decorators/admin.decorator";
import { AdminService } from "./admin.service";
import { AdminPrismaFilter } from "src/Common/Exception/Filters/Prisma/admin.prisma.filter";
import { RequestRateLimiterGuard } from "src/Common/Guards/Service/request.guard";
import { AdminGuard } from "src/Common/Guards/Service/admin.guard";

// This route is restricted to the Admin Service (or Central Admin Service) only.
// It should never be accessed externally or by unauthorized services.
// Ensure `AdminGuard` is always applied to enforce this restriction.
@Controller('admin')
@Admin()
@UseFilters(AdminPrismaFilter)
@UseGuards(RequestRateLimiterGuard('admin-delete-user',2, 60), AdminGuard)
export class AdminController{
    constructor(
        private adminService: AdminService
    ){}
    @Delete('delete-user/:id')
    async deleteUser(@Param('id', ParseIntPipe) id: number){
        return await this.adminService.deleteUserById(id);
    }

    @Post('deactivate-user/:id')
    async deactivateUser(@Param('id', ParseIntPipe) id: number){
        return await this.adminService.deactivateUserById(id);
    }

    @Post('upgrade-seller/:id')
    async changeUserType(@Param('id', ParseIntPipe) id: number){
        return await this.adminService.changeUserRoleById(id);
    }

}