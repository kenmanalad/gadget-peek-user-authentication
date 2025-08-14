import { Module } from "@nestjs/common";
import { NodeMailerService } from "./nodemailer.service";
import { CommonModule } from "../Utils/common.module";

@Module({
    imports: [CommonModule],
    providers:[NodeMailerService],
    exports:[NodeMailerService]
})
export class NodemailerModule {}