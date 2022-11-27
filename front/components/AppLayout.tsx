import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';

import { useSelector } from 'react-redux';
import UserProfile from "./Userprofile";
import LoginForm from "./LoginForm";

import styled from 'styled-components';
import useinput from '../hooks/useinput';
import { useCallback } from 'react';
import Router from 'next/router';

import Chatinguser from './Chatinguser';


const SearchInput = styled(Input.Search)`
  vertical-align : middle;
`;



const AppLayout = ({ children }) => {
  const [searchInput, onchangeSearchInput] = useinput('');
  const { me } = useSelector((state) => state.user);



  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput])
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key='123'><Link href="/"><a>메인</a></Link></Menu.Item>
        <Menu.Item key='234'><Link href="/profile"><a>프로필</a></Link></Menu.Item>
        <Menu.Item key='456'> <SearchInput enterButton
          value={searchInput}
          onChange={onchangeSearchInput}
          onSearch={onSearch}
        /></Menu.Item>

        <Menu.Item key='kekeke'><Link href="/signUp"><a>회원가입</a></Link></Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6} >
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12} >
          {children}
        </Col>
        <Col xs={24} md={6} >
          {me ? <Chatinguser me={me}/> : null}
        </Col>
      </Row>
    </div>
  )
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
}
export default AppLayout;