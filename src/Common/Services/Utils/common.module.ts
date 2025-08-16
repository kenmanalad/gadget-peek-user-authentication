import { Module } from "@nestjs/common";
import { CryptService } from "./crypt.service";
import { MailService } from "./mail.service";
import { TokenService } from "./token.service";
import { PrismaService } from "src/Common/Services/Prisma/prisma.service";
import { PrismaModule } from "src/Common/Services/Prisma/prisma.module";
import { RedisService } from "./redis.service";
import { MetaResponseService } from "./meta.response.service";

@Module({
    imports: [PrismaModule],
    providers:[CryptService, MailService, TokenService, RedisService, MetaResponseService],
    exports:[CryptService, MailService, TokenService, RedisService, MetaResponseService]
})
export class CommonModule {}