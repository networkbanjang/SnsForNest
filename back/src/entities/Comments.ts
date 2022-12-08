import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';
import { Posts } from './Posts';
import { ApiProperty } from '@nestjs/swagger';

@Index('PostId', ['postId'], {})
@Index('UserId', ['userId'], {})
@Entity('comments', { schema: 'react_nodebird' })
export class Comments {
  @ApiProperty({
    example: 1,
    description: '댓글아이디',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '이 게시글 정말 유익하다',
    description: '댓글 내용',
  })
  @Column('text', { name: 'content' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    example: 3,
    description: '댓글 작성자 아이디',
  })
  @Column('int', { name: 'UserId', nullable: true })
  userId: number | null;

  @ApiProperty({
    example: 1,
    description: '댓글단 게시글 아이디',
  })
  @Column('int', { name: 'PostId', nullable: true })
  postId: number | null;

  @ManyToOne(() => Posts, (posts) => posts.Comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'PostId', referencedColumnName: 'id' }])
  Post: Posts;

  @ManyToOne(() => Users, (users) => users.Comments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: Users;
}
