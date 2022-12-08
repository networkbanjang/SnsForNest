import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Posts } from './Posts';
import { Users } from './Users';

@Entity({ name: 'like' })
export class Likes {
  @Column({ type: 'unsigned big int', name: 'PostId', primary: true })
  postId: number;

  @Column({ type: 'unsigned big int', name: 'UserId', primary: true })
  userId: number;

  //이하 관계설정

  @ManyToOne(() => Posts, (post) => post.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'PostId', referencedColumnName: 'id' }])
  PostId: Posts[];

  @ManyToOne(() => Users, (users) => users.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  UserId: Users[];
}
