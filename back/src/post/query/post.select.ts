const SelectQuery = () => {
  return [
    'posts',
    'user.id',
    'user.nickname',
    'user.profile',
    'comment.id',
    'comment.content',
    'comment.userId',
    'comment.postId',
    'commenter.id',
    'commenter.nickname',
    'commenter.profile',
    'likers.id',
    'retweet',
    'retweetUser.id',
    'retweetUser.nickname',
    'retweetUser.profile',
    'image.id',
    'image.src',
  ];
};

export default SelectQuery;
