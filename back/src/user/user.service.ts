import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { JoinDTO } from './dto/join.request.dto';
import bcrypt from 'bcrypt';
import { FollowDTO } from './dto/follow.request.dto';
import { Follow } from 'src/entities/Follow';

@Injectable()
export class UserService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  //Get

  async getUserInfo(user: Users): Promise<Users> {
    //유저정보 불러오기
    try {
      if (user) {
        const findUser = await this.userRepository.findOne({
          where: { id: user.id },
          select: {
            Posts: { id: true },
            Followers: { id: true },
            Followings: { id: true },
          },
          relations: ['Posts', 'Followers', 'Followings'],
        });
        const { password, ...result } = findUser;
        return result;
      }
    } catch (error) {
      console.error(error);
      throw new HttpException('유저정보를 받아오지 못햇습니다,', 500);
    }
  }

  //팔로잉불러오기
  async getFollowings(limit: number, user: Users): Promise<FollowDTO[]> {
    try {
      const findUser: FollowDTO[] = await this.userRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.nickname'])
        .limit(limit)
        .where('Followerid =:id', { id: user.id })
        .innerJoin('user.Followers', 'b')
        .getMany();
      return findUser;
    } catch (error) {
      console.error(error);
      throw new HttpException('서버에 문제가생겼습니다.', 500);
    }
  }

  //팔로워 불러오기
  async getFollowers(limit: number, user: Users): Promise<FollowDTO[]> {
    try {
      const findUser: FollowDTO[] = await this.userRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.nickname'])
        .limit(limit)
        .where('Followingid =:id', { id: user.id })
        .innerJoin('user.Followings', 'b')
        .getMany();
      return findUser;
    } catch (error) {
      console.error(error);
      throw new HttpException('서버에 문제가생겼습니다.', 500);
    }
  }

  //남의 프로필 보기
  async getProfile(id: number): Promise<Users> {
    try {
      const findUser = await this.userRepository.findOne({
        where: { id },
        select: {
          Posts: { id: true },
          Followers: { id: true },
          Followings: { id: true },
        },
        relations: ['Posts', 'Followers', 'Followings'],
      });
      const { password, ...result } = findUser;
      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException('서버에 문제가생겼습니다.', 500);
    }
  }

  //Post
  async login(user: Users) {
    const result = await this.userRepository.findOne({
      //로그인
      where: { id: user.id },
      select: {
        Posts: { id: true },
      },

      relations: ['Posts', 'Followers', 'Followings'],
    });
    const { password, ...resultSecret } = result;
    return resultSecret;
  }

  async sendMail(number: number, email: string): Promise<number> {
    //이메일 보내기
    try {
      await this.mailerService.sendMail({
        to: email, //받는사람
        from: `SnsForNest`,
        subject: '이메일 인증번호 요청입니다.',
        text: `인증번호는 ${number}입니다.`,
      });
      return number;
    } catch (error) {
      console.error(error);
      throw new HttpException('이메일이 보내지지않았습니다.', 500);
    }
  }

  async signUp(joinDTO: JoinDTO): Promise<string> {
    //회원가입,
    const { email, nickname, password } = joinDTO;
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (user) {
        throw new ConflictException('유저네임 중복');
      }
      const salt = await bcrypt.genSalt();
      const hashPW = await bcrypt.hash(password, salt);
      await this.userRepository.save({
        email,
        nickname,
        password: hashPW,
      });
      return '가입이 완료되었습니다.';
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  //patch

  async updateNickname(nick: string, user: Users) {
    if (!user) {
      throw new HttpException('잘못 된 접근입니다', 403);
    }
    try {
      const findUser: Users = await this.userRepository.findOneBy({
        id: user.id,
      });
      findUser.nickname = nick;
      await this.userRepository.save(findUser);
      return findUser;
    } catch (error) {
      console.error(error);
      throw new HttpException('서버에 오류가 생겼습니다', 500);
    }
  }

  //프로필 수정 적용
  async profileSubmit(profile: string, id: number): Promise<UpdateResult> {
    try {
      const result = this.userRepository
        .createQueryBuilder('user')
        .update()
        .set({
          profile,
        })
        .where('id=:id', { id })
        .execute();
      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException(error, 500);
    }
  }

  //팔로우 추소
  async addFollow(followingId: number, followerId: number): Promise<Follow> {
    try {
      const user = this.userRepository.findOneBy({ id: followingId });
      if (!user) {
        throw new HttpException('잘못된 요청입니다.', 403);
      }
      const result = await this.followRepository.save({
        followingId,
        followerId,
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  //delete

  //언팔
  async deleteFollow(
    followingId: number,
    followerId: number,
  ): Promise<DeleteResult> {
    try {
      const user = this.userRepository.findOneBy({ id: followingId });
      if (!user) {
        throw new HttpException('잘못된 요청입니다.', 403);
      }
      const result = await this.followRepository.delete({
        followerId,
        followingId,
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
}
