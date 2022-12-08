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
  Param,
  Delete,
  HttpException,
  Patch,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/logged.guard';
import { multerOptions } from 'src/config/multerOptions';
import { User } from 'src/decorator/decorator';
import { Comments } from 'src/entities/Comments';
import { Likes } from 'src/entities/Likes';
import { Posts } from 'src/entities/Posts';
import { Users } from 'src/entities/Users';
import { DeleteResult } from 'typeorm';
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
    const result = await this.postService.createPost(body, user);
    return result;
  }

  @ApiOperation({ summary: '댓글작성' })
  @ApiResponse({ status: 200, description: '성공', type: Comments })
  @ApiProperty({
    example: '댓글내용',
    description: 'content',
    required: true,
  })
  @UseGuards(new LoggedInGuard())
  @Post('/:postId/comment')
  async createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body('content') content: string,
    @User() user: Users,
  ): Promise<Comments> {
    const result = await this.postService.createComment(
      postId,
      content,
      user.id,
    );
    return result;
  }

  //Patch
  @ApiOperation({ summary: '좋아요' })
  @ApiResponse({ status: 200, description: '성공', type: Posts })
  @UseGuards(new LoggedInGuard())
  @Patch('/:postId/like')
  async likePost(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: Users,
  ): Promise<Likes> {
    const result = await this.postService.addLike(postId, user.id);
    return result;
  }

  //delete

  @ApiOperation({ summary: '게시글 삭제' })
  @ApiResponse({ status: 200, description: '성공' })
  @UseGuards(new LoggedInGuard())
  @Delete('/:postId')
  async deletePost(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: Users,
  ): Promise<number> {
    const result: DeleteResult = await this.postService.deletePost(
      postId,
      user.id,
    );
    if (result.affected === 0) {
      throw new HttpException('삭제할 게시글이 존재하지않습니다.', 403);
    }
    return postId;
  }
}
