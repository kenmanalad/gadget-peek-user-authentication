import { Body, Controller, Post, Req, UseFilters, UseGuards } from "@nestjs/common";
import { DeactivateDTO } from "./deactivate.dto";
import { DeactivateService } from "./deactivate.service";
import { DeactivatePrismaFilter } from "src/Common/Exception/Filters/Prisma/deactivate.prisma.filter";
import { RequestRateLimiterGuard } from "src/Common/Guards/Service/request.guard";

@Controller("security")
@UseFilters(DeactivatePrismaFilter)
@UseGuards(RequestRateLimiterGuard("deactivate", 3, 1200))
export class DeactivateController{
    constructor(
        private deactivateService: DeactivateService
    ){}
    @Post("deactivate")
    async deactivateAccount(@Body() userCredentials: DeactivateDTO){
        return await this.deactivateService.deactivateAccount(userCredentials);
    }
}