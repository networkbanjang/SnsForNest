import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Posts } from 'src/entities/Posts';

export class postRequestDTO extends PickType(Posts, ['content', 'Images'] as const) {

  @ApiProperty({
    example:"1q2w3e4r",
    description:"비밀번호"
  })
  @IsArray()
  image?: string[];
}
