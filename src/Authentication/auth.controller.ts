import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./auth.dto";

@Controller('security')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('manual-auth')
    async SignIn(@Body() signInDetails: AuthDTO){
        return await this.authService.manualSignin(signInDetails);
    }
}