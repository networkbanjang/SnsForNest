import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './logger/looger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/Users';
import { Posts } from './entities/Posts';
import { Images } from './entities/Images';
import { Hashtags } from './entities/Hashtags';
import { Comments } from './entities/Comments';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql', //사용하는 DB, mysql , oracle등등
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.DBPASSWORD,
      database: process.env.DBNAME,
      entities: [Users,Posts,Images,Hashtags,Comments],
      synchronize: false, //동기화
      logging: true, //로그 남기기
      charset: 'utf8mb4',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
