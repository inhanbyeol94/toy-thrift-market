import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { HttpExceptionFilter } from './_common/utils/exception.filters';
import { SocketIoAdapter } from './adapters/socket-io.adapters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.useStaticAssets(join(__dirname, '..', 'src', '_views'));
  app.setBaseViewsDir(join(__dirname, '..', 'src', '_views'));
  app.setViewEngine('ejs');
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
