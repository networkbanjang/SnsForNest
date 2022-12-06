import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/entities/Posts';
import { HttpException, Injectable, ConflictException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { postRequestDTO } from './dto/postRequestDTO';
import SelectQuery from './query/post.select';
import { Users } from 'src/entities/Users';
import { Hashtags } from 'src/entities/Hashtags';
import { Posthashtags } from 'src/entities/PostHashtags';
import { Images } from 'src/entities/Images';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
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
        .where('posts.id > :lastId', { lastId })
        .take(limit)
        .getMany();
      return post;
    } catch (error) {
      console.log(error);
      throw new HttpException('Server Fatal error', 500);
    }
  }

  //post
  async CreatePost(body: postRequestDTO, user: Users) {
    const queryRunner = this.dataSource.createQueryRunner(); //트랜잭션을위한 쿼리 러너
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const hash = body.content.match(/#[^\s#]+/g);
      const posts = await queryRunner.manager.getRepository(Posts).save({
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
      return posts;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException('작성이 실패하였습니다.', 500);
    } finally {
      queryRunner.release();
    }
  }
}
