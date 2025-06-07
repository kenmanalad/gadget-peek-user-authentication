import { Module } from "@nestjs/common";
import { PasswordService } from "./Services/password.service";
import { ValidatorService } from "./Services/validator.service";

@Module({
    providers:[PasswordService, ValidatorService],
    exports:[PasswordService, ValidatorService]
})
export class CommonModule {}