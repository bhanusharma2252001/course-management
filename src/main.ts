import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './logger/winston-logger';
import { ValidationPipe } from '@nestjs/common';
import * as mongoose from 'mongoose';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
  mongoose.set("debug", true)
}
bootstrap();
