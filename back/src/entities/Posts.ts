import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Comments } from './Comments';
import { Hashtags } from './Hashtags';
import { Images } from './Images';
import { Users } from './Users';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Posts {
  @ApiProperty({
    example: 1,
    description: '게시판 아이디',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '내용내용냉용입니다',
    description: '게시판 내용',
  })
  @Column('text', { name: 'content' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    example: 1,
    description: '작성자 아이디',
  })
  @Column('int', { name: 'UserId', nullable: true })
  userId: number | null;

  @ApiProperty({
    example: 1,
    description: '리트윗한글 원본 아이디',
  })
  @Column('int', { name: 'RetweetId', nullable: true })
  retweetId: number | null;

  //관계
  @ManyToOne(() => Users, (users) => users.Posts, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: Users;

  @OneToMany(() => Comments, (comments) => comments.Post)
  Comments: Comments[];

  @OneToMany(() => Images, (images) => images.Post)
  Images: Images[];

  @ManyToMany(() => Users, (user) => user.Likes)
  @JoinTable({
    name: 'like',
    joinColumn: {
      name: 'PostId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'UserId',
      referencedColumnName: 'id',
    },
  })
  Likes: any[];

  @JoinTable({
    name: 'posthashtags',
    joinColumn: {
      name: 'PostId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      //inverse가 반대
      name: 'HashTagId',
      referencedColumnName: 'id',
    },
  })
  @ManyToMany(() => Hashtags, (posthashtag) => posthashtag.Posthashtags)
  Posthashtags: Hashtags[];

  @ManyToOne(() => Posts, (posts) => posts.Posts, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'RetweetId', referencedColumnName: 'id' }])
  Retweet: Posts;

  @OneToMany(() => Posts, (posts) => posts.Retweet)
  Posts: Posts[];
}
