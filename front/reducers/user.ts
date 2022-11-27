import produce from '../util/produce';

export const initialState = {
  loadUserLoading: false, // 로드 유저
  loadUserDone: false,
  loadUserError: null,

  followLoading: false, // 팔로우 시도중
  followDone: false,
  followError: null,

  unfollowLoading: false, // 언팔로우 시도중
  unfollowDone: false,
  unfollowError: null,

  logInLoading: false, // 로그인 시도중
  logInDone: false,
  logInError: null,

  logOutLoading: false, // 로그아웃 시도중
  logOutDone: false,
  logOutError: null,

  signUpLoading: false, // 회원가입 시도중
  signUpDone: false,
  signUpError: null,

  changeNicknameLoading: false, // 닉네임 변경 시도중
  changeNicknameDone: false,
  changeNicknameError: null,

  loadOtherLoading: false,
  loadOtherDone: false,
  loadOtherError: false,

  sendEmailLoading: false,  //이메일 보내기
  sendEmailDone: false,
  sendEmailError: false,

  profileUpdateLoading: false,    //프로필 업데이트하기
  profileUpdateError: false,
  profileUpdateDone: false,

  profileSubmitLoading: false,    //프로필 업데이트하기
  profileSubmitError: false,
  profileSubmitDone: false,

  me: null,
  userInfo: null,
  mailnumber: null,
};

export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";

export const LOG_OUT_REQUEST = "LOG_OUT_REQUEST";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
export const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";

export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

export const FOLLOW_REQUEST = "FOLLOW_REQUEST";
export const FOLLOW_SUCCESS = "FOLLOW_SUCCESS";
export const FOLLOW_FAILURE = "FOLLOW_FAILURE";

export const UNFOLLOW_REQUEST = "UNFOLLOW_REQUEST";
export const UNFOLLOW_SUCCESS = "UNFOLLOW_SUCCESS";
export const UNFOLLOW_FAILURE = "UNFOLLOW_FAILURE";

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

export const LOAD_MY_INFO_REQUEST = "LOAD_MY_INFO_REQUEST"
export const LOAD_MY_INFO_SUCCESS = "LOAD_MY_INFO_SUCCESS"
export const LOAD_MY_INFO_FAILURE = "LOAD_MY_INFO_FAILURE"


export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST'
export const LOAD_FOLLOWERS_SUCCESS = "LOAD_FOLLOWERS_SUCCESS"
export const LOAD_FOLLOWERS_FAILURE = "LOAD_FOLLOWERS_FAILURE"

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST'
export const LOAD_FOLLOWINGS_SUCCESS = "LOAD_FOLLOWINGS_SUCCESS"
export const LOAD_FOLLOWINGS_FAILURE = "LOAD_FOLLOWINGS_FAILURE"

export const LOAD_OTHER_REQUEST = 'LOAD_OTHER_REQUEST'
export const LOAD_OTHER_SUCCESS = "LOAD_OTHER_SUCCESS"
export const LOAD_OTHER_FAILURE = "LOAD_OTHER_FAILURE"

export const SEND_EMAIL_REQUEST = 'SEND_EMAIL_REQUEST'
export const SEND_EMAIL_SUCCESS = "SEND_EMAIL_SUCCESS"
export const SEND_EMAIL_FAILURE = "SEND_EMAIL_FAILURE"

export const PROFILE_UPDATE_REQUEST = 'PROFILE_UPDATE_REQUSET'
export const PROFILE_UPDATE_SUCCESS = "PROFILE_UPDATE_SUCCESS"
export const PROFILE_UPDATE_FAILURE = "PROFILE_UPDATE_FAILURE"

export const PROFILE_SUBMIT_REQUEST = 'PROFILE_SUBMIT_REQUEST'
export const PROFILE_SUBMIT_SUCCESS = "PROFILE_SUBMIT_SUCCESS"
export const PROFILE_SUBMIT_FAILURE = "PROFILE_SUBMIT_FAILURE"


//팔로우 차단기능 생략

//동적 액션
export const loginRequestAction = (data) => {
  return {
    type: LOG_IN_REQUEST,
    data,   //action이됨
  }
}

export const logoutRequestAction = () => {
  return {
    type: LOG_OUT_REQUEST,
  }
}

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_MY_INFO_REQUEST:
        draft.loadUserLoading = true;
        draft.loadUserDone = false;
        draft.loadUserError = false;
        break;
      case LOAD_MY_INFO_SUCCESS:
        draft.loadUserLoading = false;
        draft.me = action.data;
        draft.loadUserDone = true;
        break;
      case LOAD_MY_INFO_FAILURE:
        draft.loadUserLoading = false;
        draft.loadUserError = action.error;
        break;

      case LOG_IN_REQUEST:
        draft.logInLoading = true;
        draft.logInDone = false;
        draft.logInError = false;
        break;
      case LOG_IN_SUCCESS:
        draft.logInLoading = false;
        draft.logInDone = true;
        draft.me = action.data;
        break;
      case LOG_IN_FAILURE:
        draft.logInLoading = false;
        draft.logInError = action.error;
        break;

      case LOG_OUT_REQUEST:
        draft.logOutLoading = true;
        draft.logOutDone = false;
        draft.logOutError = false;
        break;
      case LOG_OUT_SUCCESS:
        draft.logOutLoading = false;
        draft.logOutDone = true;
        draft.logOutError = false;
        draft.me = null;
        break;
      case LOG_OUT_FAILURE:
        draft.logOutLoading = fasle;
        draft.logOutDone = false;
        draft.logOutError = action.error;
        break;

      case SIGN_UP_REQUEST:
        draft.signUpLoading = true;
        draft.signUpDone = false;
        draft.signUpError = false;
        break;

      case SIGN_UP_SUCCESS:
        draft.signUpDone = true;
        draft.signUpLoading = false;
        draft.signUpError = false;
        break;
      case SIGN_UP_FAILURE:
        draft.signUpDone = false;
        draft.signUpLoading = false;
        draft.signUpError = action.error;
        break;

      case CHANGE_NICKNAME_REQUEST:
        draft.changeNicknameLoading = true;
        draft.changeNicknameError = null;
        draft.changeNicknameDone = false;
        break;
      case CHANGE_NICKNAME_SUCCESS:
        draft.changeNicknameLoading = false;
        draft.changeNicknameDone = true;
        draft.me.nickname = action.data.nickname;
        break;
      case CHANGE_NICKNAME_FAILURE:
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = action.error;
        break;

      case ADD_POST_TO_ME:
        draft.me.Posts.unshift({ id: action.data });
        break;

      case REMOVE_POST_OF_ME:
        draft.me.Posts = draft.me.Posts.filter((e) => e.id !== action.data);
        break;

      case FOLLOW_REQUEST:
        draft.followLoading = true;
        draft.followError = false;
        draft.followDone = false;
        break;
      case FOLLOW_SUCCESS:
        draft.followLoading = false;
        draft.me.Followings.push({ id: action.data.userId });
        draft.followDone = true;
        break;
      case FOLLOW_FAILURE:
        draft.followLoading = false;
        draft.followError = action.error;
        draft.followDone = false;
        break;

      case UNFOLLOW_REQUEST:
        draft.unfollowLoading = true;
        draft.unfollowError = false;
        draft.unfollowDone = false;
        break;
      case UNFOLLOW_SUCCESS:
        draft.unfollowLoading = false;
        draft.me.Followings = draft.me.Followings.filter((e) => e.id !== action.data.userId);
        draft.unfollowDone = true;
        break;
      case UNFOLLOW_FAILURE:
        draft.unfollowLoading = false;
        draft.unfollowError = action.error;
        draft.unfollowDone = false;
        break;

      case LOAD_OTHER_REQUEST:
        draft.loadOtherLoading = true;
        draft.loadOtherError = false;
        draft.loadOtherDone = false;
        break;
      case LOAD_OTHER_SUCCESS:
        draft.loadOtherLoading = false;
        draft.userInfo = action.data;
        draft.loadOtherDone = true;
        break;
      case LOAD_OTHER_FAILURE:
        draft.loadOtherLoading = false;
        draft.loadOtherError = action.error;
        draft.loadOthersDone = false;
        break;

      case SEND_EMAIL_REQUEST:   //이메일
        draft.sendEmailLoading = true;
        draft.sendEmailError = false;
        draft.sendEmailDone = false;
        break;
      case SEND_EMAIL_SUCCESS:
        draft.sendEmailLoading = false;
        draft.sendEmailDone = true;
        draft.mailnumber = action.data
        break;
      case SEND_EMAIL_FAILURE:
        draft.sendEmailLoading = false;
        draft.sendEmailError = action.error;
        draft.sendEmailDone = false;
        break;

      case PROFILE_UPDATE_REQUEST:  //프로필 사진 수정
        draft.profileUpdateLoading = true;
        draft.profileUpdateError = false;
        draft.profileUpdateDone = false;
        break;
      case PROFILE_UPDATE_SUCCESS:
        draft.profileUpdateLoading = false;
        draft.me.profile = action.data;
        draft.profileUpdateDone = true;
        break;
      case PROFILE_UPDATE_FAILURE:
        draft.profileUpdateLoading = false;
        draft.profileUpdateError = action.error;
        draft.profileUpdateDone = false;
        break;

      case PROFILE_UPDATE_REQUEST:  //프로필 사진 적용
        draft.profileSubmitLoading = true;
        draft.profileSubmitError = false;
        draft.profileSubmitDone = false;
        break;
      case PROFILE_UPDATE_SUCCESS:
        draft.profileSubmitLoading = false;
        draft.profileSubmitDone = true;
        break;
      case PROFILE_UPDATE_FAILURE:
        draft.profileSubmitLoading = false;
        draft.profileSubmitError = action.error;
        draft.profileSubmitDone = false;
        break;

      default:
        return state;

    }
  })
};

export default reducer