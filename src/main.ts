import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TrimPipe } from './Common/Pipe/trim.pipe';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform: true}), new TrimPipe());
  app.use(cookieParser())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
