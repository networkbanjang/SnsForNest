import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/Users';
import { Posts } from './entities/Posts';
import { Images } from './entities/Images';
import { Hashtags } from './entities/Hashtags';
import { Comments } from './entities/Comments';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './logger/looger.middleware';
import { Follow } from './entities/Follow';
import { PostModule } from './post/post.module';
import { Posthashtags } from './entities/PostHashtags';
import { Likes } from './entities/Likes';

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
      entities: [
        Users,
        Posts,
        Images,
        Hashtags,
        Comments,
        Follow,
        Posthashtags,
        Likes,
      ],
      synchronize: false, //동기화
      logging: true, //로그 남기기
      charset: 'utf8mb4',
    }),
    UserModule,
    AuthModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
