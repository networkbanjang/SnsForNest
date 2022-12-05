import { PickType } from '@nestjs/swagger';
import { Users } from 'src/entities/Users';

export class FollowDTO extends PickType(Users, ['id', 'nickname'] as const) {}
