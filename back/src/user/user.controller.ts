import {
  Controller,
  Post,
  Body,
  UseGuards,
  Query,
  Get,
  ParseIntPipe,
  Req,
  Res,
  Patch,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/local.AuthGuard';
import { LoggedInGuard } from 'src/auth/logged.guard';
import { User } from 'src/decorator/decorator';
import { Users } from 'src/entities/Users';
import { FollowDTO } from './dto/follow.request.dto';
import { JoinDTO } from './dto/join.request.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Get
  @ApiOperation({ summary: '유저정보 불러오기' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: Users,
  })
  @Get()
  async getUser(@User() user: Users): Promise<Users> {
    return await this.userService.getUserInfo(user);
  }

  @ApiOperation({ summary: '팔로잉 불러오기' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: FollowDTO,
  })
  @ApiParam({ name: 'limit', type: 'number', example: '3' })
  @UseGuards(new LoggedInGuard())
  @Get('/followings')
  async getFollowings(
    @Query('limit', ParseIntPipe) limit: number,
    @User() user: Users,
  ): Promise<FollowDTO[]> {
    return await this.userService.getFollowings(limit, user);
  }

  @ApiOperation({ summary: '팔로워 불러오기' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: FollowDTO,
  })
  @ApiParam({ name: 'limit', type: 'number', example: '3' })
  @UseGuards(new LoggedInGuard())
  @Get('/followers')
  async getFollowers(
    @Query('limit', ParseIntPipe) limit: number,
    @User() user: Users,
  ): Promise<FollowDTO[]> {
    return await this.userService.getFollowers(limit, user);
  }

  //Post
  @ApiProperty({
    example: 1,
    description: 'Users 아이디',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '성공.',
    type: String,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post('')
  async singUpRequest(@Body() joinDTO: JoinDTO): Promise<string> {
    const result = await this.userService.signUp(joinDTO);
    return result;
  }

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: Users,
  })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async logIn(@User() user: Users) {
    const me = await this.userService.login(user);
    return me;
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('/logout')
  logout(@Req() req: Express.Request, @Res() res): void {
    req.logOut(() => {
      res.redirect('/');
    });
  }

  @ApiOperation({ summary: '이메일로 인증번호 보내기' })
  @Post('/sendMail')
  async sendMail(@Body() body): Promise<number> {
    const { number, email } = body;
    return await this.userService.sendMail(number, email);
  }

  //Patch
  @ApiOperation({ summary: '닉네임 변경' })
  @UseGuards(new LoggedInGuard())
  @Patch('/nickname')
  async updateNickname(@Body('nickname') nick: string, @User() user: Users) {
    return await this.userService.updateNickname(nick, user);
  }
}
