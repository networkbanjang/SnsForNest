import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UndifinedToNullInterceprtor } from './interceptor/undifined.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  const PORT = process.env.PORT || 3000;
  const config = new DocumentBuilder()
    .setTitle('next-nest SNS 만들기')
    .setDescription('express를 nest로 바꿔보자')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); //endPoint

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new UndifinedToNullInterceprtor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(cookieParser());
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(PORT);
  console.log(`PORT:${PORT} On`);
}
bootstrap();
