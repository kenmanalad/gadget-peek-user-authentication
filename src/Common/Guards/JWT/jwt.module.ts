import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "./jwt.guard";

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.register({}),
  ],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard], 
})
export class JwtGuardModule {}