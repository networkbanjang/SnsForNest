import { Button } from "antd";
import { useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";


const FollowButton = ({ post }) => {
  const dispatch = useDispatch();
  const { me, followLoading, unfollowLoading } = useSelector((state) => state.user);
  
  const isFollowing = me && me.Followings.find((e) => e.id === post.User.id);
  const onClick = useCallback(() => {
    if (isFollowing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: post.User.id,
      })
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: post.User.id,
      })
    }
  }, [isFollowing])

  if(post.User.id === me.id){
    return null;
  }
  return (<Button loading={followLoading || unfollowLoading} onClick={onClick}>
    {isFollowing ? '언팔로우' : '팔로우'}
  </Button>)
}

export default FollowButton;