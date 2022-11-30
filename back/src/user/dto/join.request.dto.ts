import {
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from 'src/entities/Users';
export class JoinDTO extends PickType(Users, [
  'email',
  'nickname',
] as const) {

  @ApiProperty({
    example:"1q2w3e4r",
    description:"비밀번호"
  })
  @MinLength(8)
  @IsString()
  password: string;
}
