import { Module } from '@nestjs/common';
import { RegistrationModule } from './Registration/registration.module';
import { PrismaModule } from './Prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { NodemailerModule } from './NodeMailer/nodemailer.module';
import { VerifyEmailModule } from './Email Verification/verify.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RegistrationModule,
    NodemailerModule,
    VerifyEmailModule
  ],
})
export class AppModule {}
