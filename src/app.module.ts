import { Module } from '@nestjs/common';
import { RegistrationModule } from './Registration/registration.module';
import { PrismaModule } from './Prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NodemailerModule } from './NodeMailer/nodemailer.module';
import { VerifyEmailModule } from './Email Verification/verify.module';
import { AuthModule } from './Authentication/auth.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject:[ConfigService],
      useFactory: async(configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: '30s'
        }
      })
    }),
    PrismaModule,
    RegistrationModule,
    NodemailerModule,
    VerifyEmailModule,
    AuthModule
  ],
})
export class AppModule {}
