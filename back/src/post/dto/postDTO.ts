import { PickType } from '@nestjs/swagger';
import { Posts } from 'src/entities/Posts';
import { Users } from 'src/entities/Users';

export class postDTO extends PickType(Posts, ['content', 'Images'] as const) {}
