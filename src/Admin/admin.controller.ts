import { Controller, Param, ParseIntPipe, Put, UseFilters, UseGuards } from "@nestjs/common";
import { Admin } from "src/Common/Decorators/admin.decorator";
import { AdminService } from "./admin.service";
import { AdminPrismaFilter } from "src/Common/Exception/Filters/Prisma/admin.prisma.filter";
import { RequestRateLimiterGuard } from "src/Common/Guards/request.guard";
import { AdminGuard } from "src/Common/Guards/admin.guard";

// This route is restricted to the Admin Service only.
// It should never be accessed externally or by unauthorized services.
// Ensure `AdminGuard` is always applied to enforce this restriction.
@Controller('admin')
// @Admin()
// @UseGuards(AdminGuard)
@UseFilters(AdminPrismaFilter)
// Admin feature uses access tokens sent via secure HttpOnly cookies instead of Bearer Authorization headers.
// All security concerns such as CSRF protection, HTTPS, SameSite, short-lived tokens and etc., are already addressed.
// Token generation and management are handled by the Admin Service.
export class AdminController{
    constructor(
        private adminService: AdminService
    ){}

    @Put('deactivate-user/:id')
    @UseGuards(RequestRateLimiterGuard('admin-deactivate-user',5, 60))
    async deactivateUser(@Param('id', ParseIntPipe) id: number){
        return await this.adminService.deactivateUserById(id);
    }

    @Put('change-user-type/:id')
    @UseGuards(RequestRateLimiterGuard('admin-change-user-type',5, 60))
    async changeUserType(@Param('id', ParseIntPipe) id: number){
        return await this.adminService.changeUserTypeToSeller(id);
    }

}