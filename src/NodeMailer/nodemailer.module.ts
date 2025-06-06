import { Module } from "@nestjs/common";
import { NodeMailerService } from "./nodemailer.service";

@Module({
    providers:[NodeMailerService],
    exports:[NodeMailerService]
})
export class NodemailerModule {}