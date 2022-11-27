import axios from "axios";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { END } from "redux-saga";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import { LOAD_POST_REQUEST } from "../../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import wrapper from "../../store/configureStore";
import {useEffect} from 'react'

const Post = () => {//[] 안이 스스로 바뀜

  const router = useRouter();
  const { id } = router.query;
  const { singlePost, loadPostError } = useSelector((state => state.post));

  useEffect(() => {
    if (loadPostError) {
      alert('해당게시글이 없거나 삭제되었습니다.');
      Router.push('/');
    }
  }, [loadPostError]);
  if (loadPostError) {
    return null;
  }

  return (
    <AppLayout>
      <Head>
        <title>
          {singlePost.User.nickname}
          님의 글
        </title>
        <meta name="description" content={singlePost.content} />
        <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
        <meta property="og:description" content={singlePost.content} />
        {/* <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'http://localhost:3065/favicon.ico'} /> */}
        <meta property="og:url" content={`http://localhost:3065/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
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

  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch(END);

  await context.store.sagaTask.toPromise();

  return { props: {} };
})
export default Post;