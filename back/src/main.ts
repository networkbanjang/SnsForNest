import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UndifinedToNullInterceprtor } from './interceptor/undifined.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filter/http-exception.filter';

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

  await app.listen(PORT);
  console.log(`PORT:${PORT} On`);
}
bootstrap();
