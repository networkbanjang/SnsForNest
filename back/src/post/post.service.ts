import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/entities/Posts';
import { HttpException, Injectable, ConflictException } from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { postRequestDTO } from './dto/postRequestDTO';
import SelectQuery from './query/post.select';
import { Users } from 'src/entities/Users';
import { Hashtags } from 'src/entities/Hashtags';
import { Posthashtags } from 'src/entities/PostHashtags';
import { Images } from 'src/entities/Images';
import { Comments } from 'src/entities/Comments';
import { Likes } from 'src/entities/Likes';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
    @InjectRepository(Likes)
    private readonly likeRepository: Repository<Likes>,
    private dataSource: DataSource,
  ) {}

  //get
  async getPosts(limit: number, lastId: number): Promise<Posts[]> {
    const selectQuery: string[] = SelectQuery();
    try {
      if (!lastId) {
        lastId = 0;
      }
      const post = await this.postRepository
        .createQueryBuilder('posts')
        .select(selectQuery)
        .orderBy('posts.createdAt', 'DESC')
        .innerJoin('posts.User', 'user')
        .leftJoin('posts.Comments', 'comment')
        .leftJoin('comment.User', 'commenter')
        .leftJoin('posts.Likes', 'likers')
        .leftJoin('posts.Images', 'image')
        .leftJoin('posts.Retweet', 'retweet')
        .leftJoin('retweet.User', 'retweetUser')
        .leftJoin('retweet.Images', 'retweetImages')
        .where('posts.id > :lastId', { lastId })
        .getMany();
      return post;
    } catch (error) {
      console.log(error);
      throw new HttpException('Server Fatal error', 500);
    }
  }

  async searchHashtag(tag: string, lastId: number): Promise<Posts[]> {
    const selectQuery: string[] = SelectQuery();
    try {
      const post = await this.postRepository
        .createQueryBuilder('posts')
        .select(selectQuery)
        .orderBy('posts.createdAt', 'DESC')
        .innerJoin('posts.User', 'user')
        .leftJoin('posts.Comments', 'comment')
        .leftJoin('comment.User', 'commenter')
        .leftJoin('posts.Likes', 'likers')
        .leftJoin('posts.Images', 'image')
        .innerJoin(
          'posts.Posthashtags',
          'postHashtags',
          'postHashtags.name=:tag',
          { tag },
        )
        .leftJoin('posts.Retweet', 'retweet')
        .leftJoin('retweet.User', 'retweetUser')
        .leftJoin('retweet.Images', 'retweetImages')
        .where('posts.id > :lastId', { lastId })
        .getMany();
      return post;
    } catch (error) {
      console.error(error);
      throw new HttpException('Server Fatal error', 500);
    }
  }

  //post
  async createPost(body: postRequestDTO, user: Users) {
    const queryRunner = this.dataSource.createQueryRunner(); //트랜잭션을위한 쿼리 러너
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const hash = body.content.match(/#[^\s#]+/g);
      const posts: Posts = await queryRunner.manager.getRepository(Posts).save({
        userId: user.id,
        content: body.content,
      });
      if (hash) {
        const key = [];
        const createHashKey = [];
        const postHashtagsKey = [];
        const hashLowerCase = hash.map(
          (element): string => element.slice(1).toLocaleLowerCase(), //일차적으로 LowerCase로 변경
        );

        const hashSlice: string = hashLowerCase
          .map((element): string => `"${element}"`)
          .join(); //해쉬태그를 문자열로 전환
        const hashtags: Hashtags[] = await queryRunner.manager //해쉬네임으로 검색
          .getRepository(Hashtags)
          .createQueryBuilder('hashtag')
          .select(['hashtag.name', 'hashtag.id'])
          .where(`hashtag.name in (${hashSlice})`)
          .getMany();

        hashtags.map((e) => {
          key.push(e.name);
          postHashtagsKey.push({ postId: posts.id, hashTagId: e.id });
        }); //검색한 값의 이름값 넣고 관계설정하기
        await Promise.all(
          hashLowerCase
            .filter((e) => !key.includes(e))
            .map((e) =>
              createHashKey.push({
                //만들 해쉬값 찾기
                name: e,
              }),
            ),
        );
        if (createHashKey.length > 0) {
          const result = await queryRunner.manager
            .getRepository(Hashtags)
            .createQueryBuilder('hashtag')
            .insert()
            .values(createHashKey)
            .execute();
          result.generatedMaps.map((e: Hashtags) => {
            postHashtagsKey.push({ postId: posts.id, hashTagId: e.id });
          });
        }

        if (postHashtagsKey.length > 0) {
          await queryRunner.manager
            .getRepository(Posthashtags)
            .createQueryBuilder('postHashTags')
            .insert()
            .values(postHashtagsKey)
            .execute();
        }
      }

      if (body.image.length >= 1) {
        const imageKeys = [];
        body.image.map((element) => {
          imageKeys.push({ postId: posts.id, src: element });
        });
        await queryRunner.manager
          .getRepository(Images)
          .createQueryBuilder('images')
          .insert()
          .values(imageKeys)
          .execute();
      }

      await queryRunner.commitTransaction();
      const selectQuery: string[] = SelectQuery();
      const fullPosts = await this.postRepository
        .createQueryBuilder('posts')
        .select(selectQuery)
        .innerJoin('posts.User', 'user')
        .leftJoin('posts.Comments', 'comment')
        .leftJoin('comment.User', 'commenter')
        .leftJoin('posts.Likes', 'likers')
        .leftJoin('posts.Images', 'image')
        .leftJoin('posts.Retweet', 'retweet')
        .leftJoin('retweet.User', 'retweetUser')
        .leftJoin('retweet.Images', 'retweetImages')
        .where('posts.id=:id', { id: posts.id })
        .getOne();
      return fullPosts;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException('작성이 실패하였습니다.', 500);
    } finally {
      queryRunner.release();
    }
  }

  //댓글작성
  async createComment(
    postId: number,
    content: string,
    userId: number,
  ): Promise<Comments> {
    try {
      const comment = await this.commentRepository
        .createQueryBuilder('comment')
        .insert()
        .values({
          content,
          postId,
          userId,
        })
        .execute();

      const fullComment = await this.commentRepository
        .createQueryBuilder('comment')
        .select(['comment', 'user.id', 'user.nickname', 'user.profile'])
        .where('comment.id=:id', { id: comment.generatedMaps[0].id })
        .innerJoin('comment.User', 'user')
        .getOne();
      return fullComment;
    } catch (error) {
      console.log(error);
      throw new HttpException('작성이 실패하였습니다.', 500);
    }
  }

  async retweetPost(postId: number, userId: number): Promise<Posts> {
    const post = await this.postRepository
      .createQueryBuilder('posts')
      .where('posts.id=:postId', { postId })
      .leftJoin('posts.Retweet', 'retweet')
      .getOne();
    if (!post) {
      throw new HttpException('잘못 된 접근입니다.', 404);
    }
    if (
      userId === post.userId ||
      (post.Retweet && post.Retweet.userId === userId)
    ) {
      throw new HttpException('자신의 글은 리트윗할수 없습니다.', 500);
    }
    if (post.retweetId) {
      throw new HttpException('리트윗한 글을 또 리트윗할 수 없습니다.', 500);
    }
    const result = await this.postRepository
      .createQueryBuilder('posts')
      .insert()
      .values({
        userId,
        content: 'retweet',
        retweetId: post.id,
      })
      .execute();

    const selectQuery: string[] = SelectQuery();

    const retweetWithPrevPost = await this.postRepository
      .createQueryBuilder('posts')
      .select(selectQuery)
      .innerJoin('posts.User', 'user')
      .leftJoin('posts.Comments', 'comment')
      .leftJoin('comment.User', 'commenter')
      .leftJoin('posts.Likes', 'likers')
      .leftJoin('posts.Images', 'image')
      .leftJoin('posts.Retweet', 'retweet')
      .leftJoin('retweet.User', 'retweetUser')
      .leftJoin('retweet.Images', 'retweetImages')
      .where('posts.retweetId=:id', { id: post.id })
      .getOne();
    return retweetWithPrevPost;
  }
  //Patch

  //좋아요추가
  async addLike(postId: number, userId: number): Promise<Likes> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .where('post.id=:id', {
        id: postId,
      })
      .getOne();
    const like = await this.likeRepository.save({
      postId,
      userId,
    });
    if (!post) {
      throw new HttpException('게시글이 존재하지 않습니다', 404);
    }
    return like;
  }

  //게시글수정
  async updatePost(
    postId: number,
    userId: number,
    content: string,
  ): Promise<Posts> {
    const queryRunner = this.dataSource.createQueryRunner(); //트랜잭션을위한 쿼리 러너
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const hash = content.match(/#[^\s#]+/g);
    try {
      const post = await queryRunner.manager
        .getRepository(Posts)
        .createQueryBuilder('posts')
        .select()
        .where('posts.id=:id', { id: postId })
        .andWhere('posts.userId=:userId', { userId })
        .getOne();

      post.content = content;

      const result = await queryRunner.manager.getRepository(Posts).save(post);

      if (hash) {
        await queryRunner.manager
          .getRepository(Posthashtags)
          .createQueryBuilder('postHashtags')
          .delete()
          .from(Posthashtags)
          .where('postId=:postId', { postId })
          .execute();
        const key = [];
        const createHashKey = [];
        const postHashtagsKey = [];
        const hashLowerCase = hash.map(
          (element): string => element.slice(1).toLocaleLowerCase(), //일차적으로 LowerCase로 변경
        );

        const hashSlice: string = hashLowerCase
          .map((element): string => `"${element}"`)
          .join(); //해쉬태그를 문자열로 전환

        const hashtags: Hashtags[] = await queryRunner.manager //해쉬네임으로 검색
          .getRepository(Hashtags)
          .createQueryBuilder('hashtag')
          .select(['hashtag.name', 'hashtag.id'])
          .where(`hashtag.name in (${hashSlice})`)
          .getMany();

        hashtags.map((e) => {
          key.push(e.name);
          postHashtagsKey.push({ postId: post.id, hashTagId: e.id });
        }); //검색한 값의 이름값 넣고 관계설정하기
        await Promise.all(
          hashLowerCase
            .filter((e) => !key.includes(e))
            .map((e) =>
              createHashKey.push({
                //만들 해쉬값 찾기
                name: e,
              }),
            ),
        );
        if (createHashKey.length > 0) {
          const result = await queryRunner.manager
            .getRepository(Hashtags)
            .createQueryBuilder('hashtag')
            .insert()
            .values(createHashKey)
            .execute();

          result.generatedMaps.map((e: Hashtags) => {
            postHashtagsKey.push({ postId: post.id, hashTagId: e.id });
          });
        }

        if (postHashtagsKey.length > 0) {
          await queryRunner.manager
            .getRepository(Posthashtags)
            .createQueryBuilder('postHashTags')
            .insert()
            .values(postHashtagsKey)
            .execute();
        }
      }
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException('작성이 실패하였습니다.', 500);
    } finally {
      queryRunner.release();
    }
  }
  //Delete
  async deletePost(postId: number, userId: number): Promise<DeleteResult> {
    try {
      const result = await this.postRepository
        .createQueryBuilder('posts')
        .delete()
        .from('Posts')
        .where('id=:id', { id: postId, userId })
        .andWhere('userId=:userId', { userId })
        .execute();
      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException('삭제 실패하였습니다', 500);
    }
  }
}
