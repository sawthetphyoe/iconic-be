import { HttpExceptionFilter } from '@/exceptions/http-exception.filter';
import { ResponseInterceptor } from '@/helpers/interceptors';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as process from 'process';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: ['*'], // Allow requests from your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // Enable credentials if you need cookies or auth headers
    allowedHeaders: 'Content-Type, Accept', // Allowed headers
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(process.env.PORT || 8080);
}
bootstrap().then(() => console.log('Server started'));
