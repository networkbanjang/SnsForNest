import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passowrdField: 'password',
    });
  }

  async validate(
    email: string,
    password: string,
    done: CallableFunction,
  ): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException("로그인이 실패하였습니다.다시 확인하여 주십시오");
    }
    return done(null, user);
  }
}
