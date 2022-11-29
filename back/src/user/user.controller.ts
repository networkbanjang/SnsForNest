import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { JoinDTO } from './dto/join.request.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '이메일로 인증번호 보내기' })
  @Post('/sendMail')
  sendMail(@Body() body): Promise<number> {
    const { number, email } = body;
    return this.userService.sendMail(number, email);
  }

  @ApiOperation({ summary: '회원가입' })
  @Post('')
  singUpRequest(@Body() joinDTO: JoinDTO): Promise<string> {
    return this.userService.signUp(joinDTO);
  }
}
