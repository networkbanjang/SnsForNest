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
  UseInterceptors,
  UploadedFile,
  HttpException,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/local.AuthGuard';
import { LoggedInGuard } from 'src/auth/logged.guard';
import { multerOptions } from 'src/config/multerOptions';
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

  @ApiOperation({ summary: '타인의 프로필 보기' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: Users,
  })
  @Get('/:id')
  async getProfile(@Param('id', ParseIntPipe) id: number): Promise<Users> {
    const result = await this.userService.getProfile(id);
    return result;
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

  @ApiOperation({ summary: '프로필 사진 업로드' })
  @UseGuards(new LoggedInGuard())
  @UseInterceptors(FileInterceptor('image', multerOptions('uploads/profiles')))
  @Patch('profileUpdate')
  profileUpdate(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      return file.filename;
    } else {
      throw new HttpException('파일업로드에 실패하였습니다', 500);
    }
  }

  @ApiOperation({ summary: '프로필 사진 적용' })
  @UseGuards(new LoggedInGuard())
  @Patch('profilesubmit')
  async profileSubmit(
    @Body('profile') profile: string,
    @User() user: Users,
  ): Promise<{ profile: string }> {
    const result = await this.userService.profileSubmit(profile, user.id);
    if (result.affected === 0) {
      throw new HttpException('프로필이 수정되지 않았습니다', 500);
    }
    return { profile };
  }

  @ApiOperation({ summary: '팔로우 추가' })
  @UseGuards(new LoggedInGuard())
  @Patch('/:userId/follow')
  async addFollow(
    @Param('userId', ParseIntPipe) followingId: number,
    @User() user: Users,
  ) {
    const result = await this.userService.addFollow(followingId, user.id);
    if (!result) {
      throw new HttpException('팔로워가 추가되지 않았습니다.', 500);
    }
    return { userId: followingId };
  }

  //Delete
  @ApiOperation({ summary: '언팔로우' })
  @UseGuards(new LoggedInGuard())
  @Delete(':userId/follow')
  async removeFollow(
    @Param('userId', ParseIntPipe) followingId: number,
    @User() user: Users,
  ) {
    const result = await this.userService.deleteFollow(followingId, user.id);
    if (result.affected === 0) {
      throw new HttpException('팔로워가 삭제되지 않았습니다.', 500);
    }
    return { userId: followingId };
  }
}
