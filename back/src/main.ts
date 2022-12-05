import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { UndifinedToNullInterceprtor } from './interceptor/undifined.interceptor';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  if (process.env.NODE_ENV === 'production') {
    app.enableCors({
      origin: true, //배포용으로는 콜스를 따로 지정할 예정
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: true,
      credentials: true,
    });
  }

  app.useStaticAssets(path.join(__dirname, '..', 'uploads'));

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
  app.use(passport.session()); //deserializeUser

  await app.listen(PORT);
  console.log(`PORT:${PORT} On`);
}
bootstrap();
