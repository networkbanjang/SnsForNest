import PropTypes from 'prop-types';
import { Button, Form, Input } from "antd";
import { useCallback,useEffect } from "react";
import useinput from '../hooks/useinput';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_COMMENT_REQUEST } from '../reducers/post';




const CommentForm = ({ post }) => {
  const [commentText, onChangeComment,setCommentText] = useinput('');
  const { addCommentDone,addCommentLoading } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const onSubmitComment = useCallback(() => {
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id },
    });
  }, [commentText])

  useEffect(()=>{
    if (addCommentDone){
      setCommentText('');
    }
  },[addCommentDone]);

  //아이디
  const id = useSelector((state) => state.user).me?.id;  //옵셔널 체이닝 AA ?. BB == 있으면 해라

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item>
        <Input.TextArea value={commentText} onChange={onChangeComment} rows={4} />
        <Button type='primary' htmlType='submit' loading={addCommentLoading} style={{zIndex:1}}>작성</Button>
      </Form.Item>
    </Form>
  );
}

CommentForm.prototype = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createAt: PropTypes.object,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};
export default CommentForm;
