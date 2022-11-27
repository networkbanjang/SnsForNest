import produce from '../util/produce';

export const initialState = {
  mainPosts: [],
  imagePaths: [],         //이미지 업로드할때 저장되는 경로
  hasMorePosts: true,

  addPostLoading: false,
  addPostDone: false,  //업로드성공여부 기본값은 false
  addPostError: false,

  addCommentLoading: false,   //댓글
  addCommentDone: false,
  addCommentError: false,

  removePostLoading: false,   //삭제
  removePostDone: false,
  removePostError: false,

  loadPostsLoading: false,  //게시글 열람
  loadPostsDone: false,
  loadPostsError: null,

  loadPostLoading: false,  //단일게시글 열람
  loadPostDone: false,
  loadPostError: null,

  likePostLoading: false,  //좋아요
  likePostDone: false,
  likePostError: null,

  unlikePostLoading: false,  //좋아요 취소
  unlikePostDone: false,
  unlikePostError: null,

  uploadImagesLoading: false, //이미지 업로드
  uploadImagesDone: false,
  uploadImagesError: null,

  retweetLoading: false,  //리트윗
  retweetDone: false,
  retweetError: null,

  updateLoading: false,  //수정
  updateDone: false,
  updateError: false,

  singlePost: null,
};

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';  //단일게시글
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';


export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";
export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const LOAD_USER_POSTS_REQUEST = "LOAD_USER_POSTS_REQUEST";
export const LOAD_USER_POSTS_SUCCESS = "LOAD_USER_POSTS_SUCCESS";
export const LOAD_USER_POSTS_FAILURE = "LOAD_USER_POSTS_FAILURE";

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_FOLLOWINGPOSTS_REQUEST = 'LOAD_FOLLOWINGPOSTS_REQUEST';
export const LOAD_FOLLOWINGPOSTS_SUCCESS = 'LOAD_FOLLOWINGPOSTS_SUCCESS';
export const LOAD_FOLLOWINGPOSTS_FAILURE = 'LOAD_FOLLOWINGPOSTS_FAILURE';

export const UPDATE_POST_REQUEST = 'UPDATE_POST_REQUEST'
export const UPDATE_POST_SUCCESS = "UPDATE_POST_SUCCESS"
export const UPDATE_POST_FAILURE = "UPDATE_POST_FAILURE"

export const REMOVE_IMAGE = "REMOVE_IMAGE";



export const addCommentRequest = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});



//이전 상태를 액션을 통해 다음상태로 만들어내는 함수
//immer가 알아서 불변성 지켜서 해줌
const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {

    case LIKE_POST_REQUEST:    //좋아요
      draft.likePostLoading = true;
      draft.likePostDone = false;
      draft.likePostError = null;
      break;
    case LIKE_POST_SUCCESS: {
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Likers.push({ id: action.data.UserId });
      draft.likePostLoading = false;
      draft.likePostDone = true;
      break;
    }
    case LIKE_POST_FAILURE:
      draft.likePostLoading = false;
      draft.likePostError = action.error;
      break;

    case UNLIKE_POST_REQUEST:    //좋아요 취소
      draft.unlikePostLoading = true;
      draft.unlikePostDone = false;
      draft.unlikePostError = null;
      break;
    case UNLIKE_POST_SUCCESS: {
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);
      draft.unlikePostLoading = false;
      draft.unlikePostDone = true;
      break;
    }
    case UNLIKE_POST_FAILURE:
      draft.unlikePostLoading = false;
      draft.unlikePostError = action.error;
      break;

    case LOAD_USER_POSTS_REQUEST:
    case LOAD_HASHTAG_POSTS_REQUEST:
    case LOAD_FOLLOWINGPOSTS_REQUEST:
    case LOAD_POSTS_REQUEST:  //게시글보기
      draft.loadPostsLoading = true;
      draft.loadPostsDone = false;
      draft.loadPostsError = null;
      break;

    case LOAD_USER_POSTS_SUCCESS:
    case LOAD_HASHTAG_POSTS_SUCCESS:
    case LOAD_FOLLOWINGPOSTS_SUCCESS:
    case LOAD_POSTS_SUCCESS:
      draft.loadPostsLoading = false;
      draft.loadPostsDone = true;
      draft.mainPosts = draft.mainPosts.concat(action.data);
      draft.hasMorePosts = action.data.length === 5;
      break;

    case LOAD_USER_POSTS_FAILURE:
    case LOAD_HASHTAG_POSTS_FAILURE:
    case LOAD_FOLLOWINGPOSTS_FAILURE:
    case LOAD_POSTS_FAILURE:
      draft.loadPostsLoading = false;
      draft.loadPostsError = action.error;
      break;

    case LOAD_POST_REQUEST:  //단일게시글보기
      draft.loadPostLoading = true;
      draft.loadPostDone = false;
      draft.loadPostError = null;
      break;
    case LOAD_POST_SUCCESS:
      draft.loadPostLoading = false;
      draft.loadPostDone = true;
      draft.singlePost = action.data;
      break;
    case LOAD_POST_FAILURE:
      draft.loadPostLoading = false;
      draft.loadPostError = action.error;
      break;

    case ADD_POST_REQUEST:  //게시글 작성
      draft.addPostLoading = true;
      draft.addPostDone = false;
      draft.addPostError = null;
      break;
    case ADD_POST_SUCCESS:
      draft.addPostLoading = false;
      draft.addPostDone = true;
      draft.mainPosts.unshift(action.data);
      draft.imagePaths = [];
      break;
    case ADD_POST_FAILURE:
      draft.addPostLoading = false;
      draft.addPostDone = false;
      draft.addPostError = action.data;
      break;


    case REMOVE_POST_REQUEST:  //게시글 삭제
      draft.removePostLoading = true;
      draft.removePostDone = false;
      draft.removePostError = null;
      break;
    case REMOVE_POST_SUCCESS:
      draft.removePostLoading = false;
      draft.removePostDone = true;
      draft.mainPosts = draft.mainPosts.filter((e) => e.id !== action.data.PostId);
      break;
    case REMOVE_POST_FAILURE:
      draft.removePostLoading = false;
      draft.removePostDone = false;
      draft.removePostError = action.error;
      break;

    case ADD_COMMENT_REQUEST:  //댓글작성
      draft.addCommentLoading = true;
      draft.addCommentDone = false;
      draft.addCommentError = null;
      break;
    case ADD_COMMENT_SUCCESS:
      const post = draft.mainPosts.find((e) => e.id === action.data.PostId);
      post.Comments.unshift(action.data);
      draft.addCommentLoading = false;
      draft.addCommentDone = true;
      break;
    case ADD_COMMENT_FAILURE:
      draft.addCommentLoading = false;
      draft.addCommentDone = false;
      draft.addCommentError = action.data;
      break;

    case UPLOAD_IMAGES_REQUEST:  //이미지 업로드
      draft.uploadImagesLoading = true;
      draft.uploadImagesDone = false;
      draft.uploadImagesError = null;
      break;
    case UPLOAD_IMAGES_SUCCESS:
      draft.imagePaths = action.data;
      draft.uploadImagesLoading = false;
      draft.uploadImagesDone = true;
      break;
    case UPLOAD_IMAGES_FAILURE:
      draft.uploadImagesLoading = false;
      draft.uploadImagesDone = false;
      draft.uploadImagesError = action.error;
      break;

    case REMOVE_IMAGE:  //이미지 제거
      draft.imagePaths = draft.imagePaths.filter((v, i) => i !== action.data);
      break;


    case RETWEET_REQUEST: //리트윗
      draft.retweetLoading = true;
      draft.retweetDone = false;
      draft.retweetError = null;
      break;
    case RETWEET_SUCCESS: {
      draft.retweetLoading = false;
      draft.retweetDone = true;
      draft.mainPosts.unshift(action.data);
      break;
    }
    case RETWEET_FAILURE:
      draft.retweetLoading = false;
      draft.retweetError = action.error;
      break;

    case UPDATE_POST_REQUEST:  //수정
      draft.updateLoading = true;
      draft.updateLError = false;
      draft.updateDone = false;
      break;
    case UPDATE_POST_SUCCESS:
      draft.updateLoading = false;
      draft.updateDone = true;
      draft.mainPosts.find((v) => v.id === action.data.PostId).content = action.data.content;
      break;
    case UPDATE_POST_FAILURE:
      draft.updateLoading = false;
      draft.updateLError = action.error;
      draft.updateLDone = false;
      break;

    default:
      break;
  }
});


export default reducer;