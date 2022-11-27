import Link from 'next/link';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { useState, useCallback ,useEffect} from 'react';
import {useSelector} from 'react-redux';
import TextArea from 'antd/lib/input/TextArea';

const PostCardContent = ({ postData, editMode,onCancelUpdate,onUpdate}) => {
  const {updateLoading,updateDone} = useSelector((state)=>state.post);
  const [editText, setEditText] = useState(postData); //Props를 바꿀수는없지만 State는 바꿀수 있음
  useEffect(()=>{
    if(updateDone){
      onCancelUpdate();
    }
  },[updateDone]);

  const onChangeText = useCallback((e) => {
    setEditText(e.target.value);
  })
  
  return (
    <div>
      {editMode
        ? (
          <>
            <TextArea value={editText} onChange={onChangeText} />
            <Button.Group>
              <Button loading={updateLoading} onClick={onUpdate(editText)} type='primary'>수정</Button>
              <Button type='danger' onClick={onCancelUpdate}>취소</Button> 
            </Button.Group>
          </>
        )
        : postData.split(/(#[^\s#]*)/g).map((v) => {
          if (v.match(/(#[^\s#]*)/g)) {
            return (
              <Link
                href={`/hashtag/${v.slice(1)}`}
                key={v}
              >
                <a>{v}</a>
              </Link>
            )
          }
          return v;
        })}

    </div>
  )
}

PostCardContent.prototype = {
  postData: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
}

PostCardContent.defaultProps = {
  editMode: false,
}
export default PostCardContent;
