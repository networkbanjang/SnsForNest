import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Posts } from "./Posts";
import { ApiProperty } from '@nestjs/swagger';


@Index("PostId", ["postId"], {})
@Entity("images", { schema: "react_nodebird" })
export class Images {
  @ApiProperty({
    example: 1,
    description: '이미지 아이디',
  })
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @ApiProperty({
    example: "사진29123894.png",
    description: '이미지 경로',
  })
  @Column("varchar", { name: "src", nullable: true, length: 200 })
  src: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    example: 1,
    description: '게시글 아이디',
  })
  @Column("int", { name: "PostId", nullable: true })
  postId: number | null;

  @ManyToOne(() => Posts, (posts) => posts.Images, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "PostId", referencedColumnName: "id" }])
  Post: Posts;
}
