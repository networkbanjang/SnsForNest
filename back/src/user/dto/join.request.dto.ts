import {
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from 'src/entities/Users';
export class JoinDTO extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {

  @MinLength(8)
  @IsString()
  password: string;
}
