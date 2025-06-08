import { Module } from "@nestjs/common";
import { PasswordService } from "./Services/password.service";
import { ValidatorService } from "./Services/validator.service";
import { MailService } from "./Services/mail.service";

@Module({
    providers:[PasswordService, ValidatorService, MailService],
    exports:[PasswordService, ValidatorService, MailService]
})
export class CommonModule {}