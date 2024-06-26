import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './socket-io-adapter';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { urlencoded, json } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(json({ limit: '50mb' }));
  const configService = app.get(ConfigService);
  // const port = parseInt(configService.get('PORT'));
  const clientPort = 3000;
  app.enableCors({
    origin: [
      `http://localhost:${clientPort}`,
      new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
    ],
    credentials: true,
  });
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  // app.setGlobalPrefix('api');
  // logger.log(`Server is running on: ${port}`);
  await app.listen(4000);
  // logger.log(`Server is running on: ${port}`);
}
bootstrap();
