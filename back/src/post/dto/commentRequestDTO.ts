import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Comments } from 'src/entities/Comments';
import { Posts } from 'src/entities/Posts';

export class commentRequestDTO extends PickType(Comments, [
  'content',
  'postId',
  'userId',
] as const) {}
