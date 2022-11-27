import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { loginRequestAction } from '../reducers/user';
import useinput from "../hooks/useinput";



const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 15px;
  margin:10px;
`;
const LoginForm = () => {
  const { logInLoading, logInError } = useSelector((state) => state.user);
  const dispath = useDispatch();

  const [email, onChangeEmail] = useinput('');
  const [password, onChangePassword] = useinput('');

  const onSubmitForm = useCallback(() => {
    dispath(loginRequestAction({ email, password }));
  }, [email, password]);

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError])

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor='user-id' type='email'>이메일</label>
        <br />
        <Input name='user-id' value={email} onChange={onChangeEmail} required />
      </div>
      <div>
        <label htmlFor='user-password'>비밀번호</label>
        <br />
        <Input name='user-password' type='password' value={password} onChange={onChangePassword} required />
      </div>
      <ButtonWrapper>
        <Button type='primary' htmlType='submit' loading={logInLoading} >로그인</Button>
        <Link href='/signUp'><a><Button>회원가입</Button></a></Link>
        <a href= 'http://localhost:3065/loginappend/kakaologin'> <Button >카카오톡</Button></a>
      </ButtonWrapper>

    </FormWrapper>
  );

}
export default LoginForm;