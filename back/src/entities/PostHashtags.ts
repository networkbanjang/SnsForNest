import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Hashtags } from './Hashtags';
import { Posts } from './Posts';

@Entity()
export class Posthashtags {
  
  @Column({ type: 'unsigned big int', name: 'PostId', primary: true })
  postId: number;

  @Column({ type: 'unsigned big int', name: 'HashTagId', primary: true })
  hashTagId: number;

  //이하 관계설정

  @ManyToOne(() => Posts, (post) => post.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'PostId', referencedColumnName: 'id' }])
  PostId: Posts[];

  @ManyToOne(() => Hashtags, (hashtags) => hashtags.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'HashTagId', referencedColumnName: 'id' }])
  HashTagId: Hashtags[];
}
