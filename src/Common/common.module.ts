import { Module } from "@nestjs/common";
import { CryptService } from "./Services/crypt.service";
import { MailService } from "./Services/mail.service";
import { TokenService } from "./Services/token.service";
import { PrismaService } from "src/Prisma/prisma.service";
import { PrismaModule } from "src/Prisma/prisma.module";
import { RedisService } from "./Services/redis.service";

@Module({
    imports: [PrismaModule],
    providers:[CryptService, MailService, TokenService, RedisService],
    exports:[CryptService, MailService, TokenService, RedisService]
})
export class CommonModule {}