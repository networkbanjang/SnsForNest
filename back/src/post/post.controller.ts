import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Body,
  Req,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/logged.guard';
import { multerOptions } from 'src/config/multerOptions';
import { User } from 'src/decorator/decorator';
import { Posts } from 'src/entities/Posts';
import { Users } from 'src/entities/Users';
import { postRequestDTO } from './dto/postRequestDTO';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  //Get
  @ApiOperation({ summary: '게시글 가져오기' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: Posts,
  })
  @Get('/')
  async getPosts(
    @Query() query: { limit: string; lastId?: string },
  ): Promise<Posts[]> {
    const limit = parseInt(query.limit);
    const lastId = parseInt(query.lastId);
    const result = await this.postService.getPosts(limit, lastId);
    return result;
  }

  //post
  @ApiOperation({ summary: '파일 업로드' })
  @UseGuards(new LoggedInGuard())
  @UseInterceptors(FilesInterceptor('image', 6, multerOptions('uploads')))
  @Post('images')
  uploadImage(@UploadedFiles() files: Array<Express.Multer.File>) {
    const result = files.map((e) => e.filename);
    return result;
  }

  @ApiOperation({ summary: '게시글 업로드' })
  @Post('/')
  async createPost(@Body() body: postRequestDTO, @User() user: Users) {

    const result = await this.postService.CreatePost(body, user);
    return result;
  }
}
