import styled from "styled-components";
import { useRef, useCallback, useState, useEffect } from 'react';
import { Avatar, Button, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { PROFILE_SUBMIT_REQUEST, PROFILE_UPDATE_REQUEST as PROFILE_UPDATE_REQUEST } from "../reducers/user";

const ProfileEditForm = ({ me }) => {
  const dispatch = useDispatch();
  const { profileUpdateError,profileSubmitLoading } = useSelector((state) => state.user);

  const AvatarWrapper = styled(Avatar)` 
  margin:0 auto;
  display:block;
`;  //styled 컴포넌트

  const ButtonWrapper = styled(Button)`
  margin:0 auto;
  display:block;
  margin-top:10px;
  margin-bottom:10px;
`;
  const imageInput = useRef();

  const onClickImageUpload = useCallback(() => {   //프로팔 올리기
    imageInput.current.click();              //imageInput을 클릭한걸로 만든다
  }, [imageInput.current])

  useEffect(() => {
    if (profileUpdateError) {
      alert(profileUpdateError);
    }
  }, [profileUpdateError]);

  const onChangeImages = useCallback((event) => {
    const imageFormData = new FormData(); //
    imageFormData.append('image', event.target.files[0]);   //이벤트 타겟의 파일 구하기

    dispatch({
      type: PROFILE_UPDATE_REQUEST,
      data: imageFormData,
    });
  });

  const onUpdate = useCallback(() => {
    dispatch({
      type: PROFILE_SUBMIT_REQUEST,
      data: me.profile,
    })
  }, [me.profile])


  return (
    <Form encType="multipart/form-data">
      {me.profile ? <AvatarWrapper size={100} src={"http://localhost:3065/profiles/"+me.profile} /> 
      : <AvatarWrapper size={100} >{me.nickname[0]}</AvatarWrapper>}
      < ButtonWrapper onClick={onClickImageUpload} > 사진 업로드</ButtonWrapper >
      < ButtonWrapper type="primary" onClick={onUpdate} loading={profileSubmitLoading} > 적용</ButtonWrapper >
      <input type="file" name="image" hidden ref={imageInput} onChange={onChangeImages} accept='image/gif,image/jpeg,image/png' />
    </Form>
  )
};


export default ProfileEditForm;