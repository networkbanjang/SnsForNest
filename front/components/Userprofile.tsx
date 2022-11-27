import { Avatar, Button, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from 'react';
import Link from 'next/link'

import { logoutRequestAction } from '../reducers/user'

const UserProfile = () => {
  const dispath = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user)   // 구조화할당 안하면 me =useSelector((state)=>state.user.me)

  const logout = useCallback(() => {
    dispath(logoutRequestAction());
  }, [])
  return (
    <Card
      actions={[
        <div key="twit"><Link href={`/user/${me.id}`}><a>트윗 수<br />{me.Posts.length}</a></Link></div>,
        <div key="following"><Link href={'/followings'}><a>팔로잉<br />{me.Followings.length}</a></Link></div>,
        <div key="follower"><Link href={'/profile'}><a>팔로워<br />{me.Followers.length}</a></Link></div>,
      ]}>

      <Card.Meta 
      avatar={(<Link href={`/user/${me.id}`} prefetch={false}>
        {me.profile ? <Avatar src={"http://localhost:3065/profiles/"+me.profile}/> : <a><Avatar>{me.nickname[0]}</Avatar></a>}
      </Link>
      )} title={me.nickname} />
      <Button onClick={logout} loading={logOutLoading}>로그 아웃</Button>
    </Card>
  )
}

export default UserProfile;