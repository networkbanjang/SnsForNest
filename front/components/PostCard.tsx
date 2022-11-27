import { Card, Button, Popover, Avatar, List, Comment } from 'antd';
import PropTypes from 'prop-types';
import { RetweetOutlined, HeartOutlined, MessageOutlined, EllipsisOutlined, HeartTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PostImages from './Postimages';
import { useMemo, useState, useCallback } from 'react'
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import { LIKE_POST_REQUEST, REMOVE_POST_REQUEST, RETWEET_REQUEST, UNLIKE_POST_REQUEST, UPDATE_POST_REQUEST } from '../reducers/post';
import FollowButton from './Follow';
import Link from 'next/link';
import moment from 'moment';
import 'moment/locale/ko'; // 이줄 추가


const PostCard = ({ post }) => {
  moment.locale('ko'); //날짜 라이브러리 한글로 바꾸기
  const id = useSelector((state) => state.user).me?.id;  //옵셔널 체이닝 AA ?. BB == 있으면 해라

  const dispatch = useDispatch();
  //css영역
  const style = useMemo(() => ({
    marginBottom: '20px',
  }), [])
  //state 영역
  const [comment, setComment] = useState(false);
  const [editMode, setEditMode] = useState(false);


  //이벤트 처리 영역
  const onLike = useCallback(() => {
    dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, []);

  const onUnLike = useCallback(() => {
    dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    })
  }, []);


  const onComment = useCallback(() => {
    setComment(prev => !prev);
  }, [])

  const onRemovePost = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    })
  }, []);

  const onChangePost = useCallback(() => {
    setEditMode(true);
  }, []);

  const onCancelUpdate = useCallback(() => {
    setEditMode(false);
  }, []);

  const onUpdate = useCallback((editText) => () => {
    dispatch({
      type: UPDATE_POST_REQUEST,
      data: {
        postId: post.id,
        content: editText,
      }
    })
  }, [post])

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    }, [id]);
  })



  const liked = post.Likers.find((e) => e.id === id);

  return (
    <div style={style}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="reteet" onClick={onRetweet} />,   //리트윗 아이콘 배열엔 반드시 key
          liked
            ? <HeartTwoTone twoToneColor='red' key="heart" onClick={onUnLike} />  //하트아이콘 비활성화
            : <HeartOutlined key="heart" onClick={onLike} />,     //하트 아이콘 활성화
          <MessageOutlined key="message" onClick={onComment} />,   //리플 아이콘
          <Popover key="more" content={(
            <Button.Group>
              {id && post.User.id === id ? (<>
                {!post.RetweetId && <Button onClick={onChangePost} type='primary' >수정</Button>}
                <Button type='danger' onClick={onRemovePost}>삭제</Button> </>)
                : <Button>신고</Button>}
            </Button.Group>
          )}>
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
        extra={id && <FollowButton post={post} />}
      >

        {post.RetweetId && post.Retweet
          ? (
            <Card
              cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
            >
              <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY-MM-DD')}</div>
              <Card.Meta
                avatar={<Link href={`/user/${post.Retweet.User.id}`}>
                  {post.Retweet.User.profile ?
                    <a><Avatar src={'http://localhost:3065/profiles/' + post.Retweet.User.profile} /></a> :
                    <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar> </a>}
                </Link>}
                title={post.Retweet.User.nickname}
                description={<PostCardContent onCancelUpdate={onCancelUpdate} onUpdate={onUpdate} postData={post.Retweet.content} />}
              />
            </Card>
          )
          : (
            <>
              <div style={{ float: 'right' }}>{moment(post.createdAt).fromNow()}</div>
              <Card.Meta
                avatar={<Link href={`/user/${post.User.id}`}>
                  {post.User.profile ?
                    <a><Avatar src={'http://localhost:3065/profiles/' + post.User.profile} /></a> :
                    <a><Avatar>{post.User.nickname[0]}</Avatar> </a>}

                </Link>}
                title={post.User.nickname}
                description={<PostCardContent onCancelUpdate={onCancelUpdate} onUpdate={onUpdate} editMode={editMode} postData={post.content} />}
              />
            </>
          )}
      </Card>
      {comment && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment author={item.User.nickname}
                  avatar={<Link href={`/user/${item.User.id}`}>
                    {item.User.profile ?
                      <a><Avatar src={'http://localhost:3065/profiles/' + item.User.profile} /></a> :
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>}
                  </Link>}
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}

    </div >

  )
}

PostCard.prototype = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};
export default PostCard;