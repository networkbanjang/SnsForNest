import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/local.AuthGuard';
import { JoinDTO } from './dto/join.request.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiProperty({
    example:1,
    description:"Users 아이디",
    required:true,
  })
  @ApiOperation({ summary: '이메일로 인증번호 보내기' })
  @Post('/sendMail')
  sendMail(@Body() body): Promise<number> {
    const { number, email } = body;
    return this.userService.sendMail(number, email);
  }

  @ApiResponse({
    status: 200,
    description: '성공.',
    type: String,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post('')
  singUpRequest(@Body() joinDTO: JoinDTO): Promise<string> {
    return this.userService.signUp(joinDTO);
  }

  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  logIn(@Req() req:any) {
    return req.user;
  }
}
