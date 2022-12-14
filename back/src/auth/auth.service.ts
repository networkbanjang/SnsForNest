import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const { password, ...userWithoutPassowrd } = user; //패스워드만 빼고 가지고 오기
      return userWithoutPassowrd;
    }
    return null;
  }

  async kakaoUser(accessToken, refreshToken, profile, done) {
    try {
      const exUser = await this.userRepository.findOne({
        where: { snsId: profile.id },
      });
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await this.userRepository.save({
          email: profile._json.kakao_account.email,
          nickname: profile.displayName,
          snsId: profile.id,
        });
        done(null, newUser);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
}
