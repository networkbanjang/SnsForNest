import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Posts } from './Posts';
import { ApiProperty } from '@nestjs/swagger';


@Entity()
export class Hashtags {
  @ApiProperty({
    example: 1,
    description: '해시태그 아이디',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: "nest.js",
    description: '해시태그 이름',
  })
  @Column('varchar', { name: 'name', length: 20 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //이하 관계
  @JoinTable({
    name: 'posthashtags',
    joinColumn: {
      name: 'PostId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'HashtagId',
      referencedColumnName: 'id',
    },
  })
  @ManyToMany(() => Posts, (posthashtag) => posthashtag.Posthashtags)
  Posthashtags: Posts[];
}
