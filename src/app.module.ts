import { Module } from '@nestjs/common';
import { RegistrationModule } from './Registration/registration.module';


@Module({
  imports: [RegistrationModule],
})
export class AppModule {}
