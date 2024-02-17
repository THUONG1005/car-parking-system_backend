import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters';
import { LoggerService } from './shared/logger/logger.service';

async function bootstrap() {
  /* Set time cho server */
  process.env.TZ = 'Asia/Ho_Chi_Minh';

  /* Create app */
  const app = await NestFactory.create(AppModule);

  /* App configs */
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors();

  /* Cors configs */
  app.enableCors({
    allowedHeaders: [
      'origin',
      'x-requested-with',
      'content-type',
      'accept',
      'authorization',
      'permissions-policy',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    origin: ['http://localhost:3000/api', 'http://127.0.0.1:5678'],
    credentials: true,
  });

  /* Listen on port */
  await app.listen(Number(process.env.SERVER_PORT)).then(() => {
    const logger = new LoggerService('APP');

    logger.info('App running on port: ' + String(process.env.SERVER_PORT));
  });
}


bootstrap();
