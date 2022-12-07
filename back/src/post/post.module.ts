import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from 'src/entities/Comments';
import { Hashtags } from 'src/entities/Hashtags';
import { Images } from 'src/entities/Images';
import { Posthashtags } from 'src/entities/PostHashtags';
import { Posts } from 'src/entities/Posts';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Hashtags, Posthashtags,Images,Comments])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
