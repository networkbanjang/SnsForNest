import { all, fork } from 'redux-saga/effects'
import axios from 'axios';

import postSaga from './post';
import userSaga from './user';
import backurl from '../config/config';
const backURL= backurl
axios.defaults.baseURL = backURL  //베이스 URL 설정하기
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([   //all은 배열을 받음, 동시에 실행
    fork(userSaga),   //fork는 함수를  실행
    fork(postSaga),
  ]);
}