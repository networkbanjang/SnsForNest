import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/entities/Posts';
import { HttpException, Injectable, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { postDTO } from './dto/postDTO';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
  ) {}

  //get
  async getPosts(limit: number, lastId: number): Promise<Posts[]> {
    try {
      if (!lastId) {
        lastId = 10;
      }
      const post = await this.postRepository
        .createQueryBuilder('posts')
        .select([
          'posts',
          'user.id',
          'user.nickname',
          'user.profile',
          'comment.id',
          'comment.content',
          'comment.userId',
          'comment.postId',
          'commenter.id',
          'commenter.nickname',
          'commenter.profile',
          'likers.id',
          'retweet',
          'retweetUser.id',
          'retweetUser.nickname',
          'retweetUser.profile',
          'image.id',
          'image.src'
        ])
        .orderBy('posts.createdAt', 'DESC')
        .innerJoin('posts.User', 'user')
        .leftJoin('posts.Comments', 'comment')
        .leftJoin('comment.User', 'commenter')
        .leftJoin('posts.Likes', 'likers')
        .leftJoin('posts.Images', 'image')
        .leftJoin('posts.Retweet', 'retweet')
        .leftJoin('retweet.User', 'retweetUser')
        .where('posts.id < :lastId', { lastId })
        .take(limit)
        .getMany();
      return post;
    } catch (error) {
      console.log(error);
      throw new HttpException('Server Fatal error', 500);
    }
  }

  //post
  async CreatePost(body: postDTO) {
    try {
      const hashtag = body.content.match(/#[^\s#]+/g);

      console.log(body);
    } catch (error) {
      console.error(error);
      throw new HttpException('작성이 실패하였습니다.', 500);
    }
  }
}
