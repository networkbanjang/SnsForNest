import { Form, Input } from 'antd';
import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import useinput from "../hooks/useinput";
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';



const NickNameEditForm = () => {
  const { me } = useSelector((state) => state.user);
  const [nickname, onChangeNickname] = useinput(me?.nickname || '');

  const dispatch = useDispatch();

  const style = useMemo(() => ({
    marginBottom: '20px',
    border: '1px solid #d9d9d9',
    padding: '20px',
  }), [nickname]);

  const onSearch = useCallback(() => {
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname,
    })
  }, [nickname]);
  return (
    <Form style={style}>
      <Input.Search addonBefore="닉네임" enterButton="수정" value={nickname} onChange={onChangeNickname} onSearch={onSearch} />
    </Form>
  )
};

export default NickNameEditForm;