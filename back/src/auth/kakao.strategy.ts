import { Strategy } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class KaKaoStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.KAKAO_ID,
      callbackURL: process.env.KAKAO_CALLBACK, //콜백 링크 지정
    });
  }
  async validate(accessToken, refreshToken, profile, done): Promise<any> {

    const user = await this.authService.kakaoUser(
      accessToken,
      refreshToken,
      profile,
      done,
    );

    return done(null, user);
  }
}
