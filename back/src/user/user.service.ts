import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { JoinDTO } from './dto/join.request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async sendMail(number: number, email: string): Promise<number> {
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

}
