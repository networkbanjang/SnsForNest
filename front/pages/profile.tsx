import AppLayout from "../components/AppLayout";
import Head from "next/head";
import NickNameEditForm from "../components/NickNameEditForm";
import ProfileEditForm from "../components/ProfileEditForm"
import FollowList from "../components/FollowList";
import useSWR from "swr";

import { useSelector } from "react-redux";
import { useEffect, useState, useCallback} from 'react';
import Router from "next/router";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import axios from "axios";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = ({ data }) => {


  const [followerLimit, setfollowerLimit] = useState(3);
  const [followingsLimit, setfollowingsLimit] = useState(3);

  const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followerLimit}`, fetcher)
  // fetcher = 이주소를 실제로 어떻게 가져올것인가
  const { data: followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher)
  //둘 다 없으면 로딩중, data가 차있으면성공 error가 차있으면 실패
  const { me } = useSelector((state) => state.user);


  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setfollowingsLimit((prev) => prev + 3);
  })

  const loadMoreFollowers = useCallback(() => {
    setfollowerLimit((prev) => prev + 3);
  })

  if (followerError || followingError) {
    console.error(followerError, followingError);
    return <div>팔로잉/팔로워 로딩 중 에러가 발생합니다.</div>   //return이 hooks보다 위에있을 수 없다.
  }
  if (!me) {
    return "LOADING";
  }
  return (
    <>


      <Head>
        <title>내 프로필</title>
      </Head>
      <AppLayout>
 
        <ProfileEditForm me={me} />
        <NickNameEditForm />
        <FollowList header="팔로잉 목록" data={followingsData} onclickMore={loadMoreFollowings} loading={!followingError && !followingsData} />
        <FollowList header="팔로워 목록" data={followersData} onclickMore={loadMoreFollowers} loading={!followerError && !followersData} />
      </AppLayout>
    </>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';   //헤더 정보가 context.req안에 들어있음
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });

  context.store.dispatch(END);
  console.log('엔드!');
  await context.store.sagaTask.toPromise();
  return {};
})
export default Profile;