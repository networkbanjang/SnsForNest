import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Posts } from 'src/entities/Posts';

export class postRequestDTO extends PickType(Posts, ['content'] as const) {

  @IsArray()
  image?: string[];
}
