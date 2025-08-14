import { Module } from '@nestjs/common';
import { RegistrationModule } from './Registration/registration.module';
import { PrismaModule } from './Common/Services/Prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NodemailerModule } from './Common/Services/NodeMailer/nodemailer.module';
import { VerifyEmailModule } from './Email Verification/verify.module';
import { AuthModule } from './Authentication/Manual Authentication/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { RefreshModule } from './Refresh Token/refresh.module';
import { GoogleModule } from './Authentication/Oauth/Google/google.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from './Admin/admin.module';
import { SendCodeModule } from './Forgot Password/Send Code/sendCode.module';
import { ForgotPasswordVerifyModule } from './Forgot Password/Verify Code/forgot.verify.module';
import { ChangePasswordModule } from './Forgot Password/Change Password/change.password.module';
import { JwtGuardModule } from './Common/Guards/JWT/jwt.module';
import { PasswordUpdateModule } from './Update/Password/password.update.module';
import { SendCodeUpdateEmailModule } from './Update/Email Address/Send Code/send.code.email.module';
import { ChangeEmailModule } from './Update/Email Address/Change Email Address/change.email.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 5 }], 
    })
    ,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject:[ConfigService],
      useFactory: async(configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: '15m'
        }
      })
    }),
    PrismaModule,
    RegistrationModule,
    NodemailerModule,
    VerifyEmailModule,
    AuthModule,
    RefreshModule,
    GoogleModule,
    AdminModule,
    SendCodeModule,
    ForgotPasswordVerifyModule,
    ChangePasswordModule,
    JwtGuardModule, 
    PasswordUpdateModule,
    SendCodeUpdateEmailModule,
    ChangeEmailModule
  ],
})
export class AppModule {}
