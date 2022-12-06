import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtags } from 'src/entities/Hashtags';
import { Posthashtags } from 'src/entities/PostHashtags';
import { Posts } from 'src/entities/Posts';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Hashtags, Posthashtags])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
