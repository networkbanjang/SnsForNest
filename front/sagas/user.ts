import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import {
  CHANGE_NICKNAME_FAILURE,
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  FOLLOW_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_OTHER_FAILURE,
  LOAD_OTHER_REQUEST,
  LOAD_OTHER_SUCCESS,
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  PROFILE_SUBMIT_FAILURE,
  PROFILE_SUBMIT_REQUEST,
  PROFILE_SUBMIT_SUCCESS,
  PROFILE_UPDATE_FAILURE,
  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  SEND_EMAIL_FAILURE,
  SEND_EMAIL_REQUEST,
  SEND_EMAIL_SUCCESS,
  UNFOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS
} from "../reducers/user";
import { LOG_OUT_REQUEST, LOG_OUT_SUCCESS, SIGN_UP_FAILURE, SIGN_UP_REQUEST, SIGN_UP_SUCCESS } from '../reducers/user';
import axios from 'axios'



function logInAPI(data) {
  return axios.post('/user/login', data);
}

function* login(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post('user/logout')
}

function* logOut() {
  try {
    const result = yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (error) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: error.response.data,
    })
  }
}

function signUpAPI(data) {
  return axios.post('/user', data);  //data는 객체
}

function* signUP(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}

function followAPI(data) {
  return axios.patch(`user/${data}/follow`)
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: FOLLOW_FAILURE,
      error: error.response.data,
    })
  }
}

function unfollowAPI(data) {
  return axios.delete(`user/${data}/follow`);
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: error.response.data,
    })
  }
}

function loadUserAPI() {            //내정보 가지고오기
  return axios.get('/user');
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}



function loadOtherAPI(data) {                           //남의 정보 가지고오기
  return axios.get(`/user/${data}`);
}

function* loadOther(action) {
  try {
    const result = yield call(loadOtherAPI, action.data);
    yield put({
      type: LOAD_OTHER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_OTHER_FAILURE,
      error: err.response.data,
    });
  }
}

function changeNickAPI(data) {//닉네임변경
  return axios.patch('/user/nickname', { nickname: data });
}

function* changeNick(action) {  
  try {
    const result = yield call(changeNickAPI, action.data);
    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      error: err.response.data,
    });
  }
}

function sendEmailAPI(data) { //인증번호 보내기
  return axios.post('/user/sendMail', data);
}

function* sendEmail(action) {
  try {
    const result = yield call(sendEmailAPI, action.data);
    yield put({
      type: SEND_EMAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: SEND_EMAIL_FAILURE,
      error: err.response.data,
    });
  }
}

function prifileUpdateAPI(data) { //프로필 수정
  return axios.post('/user/profileUpdate', data);
}

function* prifileUpdate(action) {
  try {
    const result = yield call(prifileUpdateAPI, action.data);
    yield put({
      type: PROFILE_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: PROFILE_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

function prifileSubmitAPI(data) { //프로필 수정 적용
  return axios.patch('/user/profilesubmit', { profile: data });
}

function* prifileSubmit(action) {
  try {
    const result = yield call(prifileSubmitAPI, action.data);
    yield put({
      type: PROFILE_SUBMIT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: PROFILE_SUBMIT_FAILURE,
      error: err.response.data,
    });
  }
}

//지켜보고있다
function* watchLoadUser() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadUser);
}

function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, login);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}
function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUP);
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}
function* watchunFollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}
function* watchChangeNick() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNick);
}


function* watchotherInfo() {
  yield takeLatest(LOAD_OTHER_REQUEST, loadOther);
}

function* watchSendMail() {
  yield takeLatest(SEND_EMAIL_REQUEST, sendEmail);
}

function* watchProfileUpdate() {
  yield takeLatest(PROFILE_UPDATE_REQUEST, prifileUpdate);
}

function* watchProfileSubmit() {
  yield takeLatest(PROFILE_SUBMIT_REQUEST, prifileSubmit);
}

export default function* userSaga() {
  yield all([
    fork(watchLoadUser),
    fork(watchLogin),
    fork(watchLogOut),
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchunFollow),
    fork(watchChangeNick),
    fork(watchotherInfo),
    fork(watchSendMail),
    fork(watchProfileUpdate),
    fork(watchProfileSubmit),

  ])
}