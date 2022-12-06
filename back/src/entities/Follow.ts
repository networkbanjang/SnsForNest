import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from './Users';

@Entity()
export class Follow {
  @Column({ type: 'unsigned big int', name: 'FollowerId', primary: true })
  followerId: number;

  @Column({ type: 'unsigned big int', name: 'FollowingId', primary: true })
  followingId: number;

  //이하 관계설정

  @ManyToOne(() => Users, (user) => user.Followers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'FollowerId', referencedColumnName: 'id' }])
  FollowerId: Users[];

  @ManyToOne(() => Users, (user) => user.Followings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'FollowingId', referencedColumnName: 'id' }])
  FollowingId: Users[];
}
