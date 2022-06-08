const httpStatus = require("http-status");
const { User, Post } = require("../models");
const ApiError = require("../utils/ApiError");
/**
 * Create a post
 * @param {Object} postBody
 * @returns {Promise<Post>}
 */
const createPost = async (postBody) => {
  const count = await Post.find().count();
  const user = await User.findById(postBody.user);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No user found.");
  }
  const newPost = {
    title: postBody.title,
    user: postBody.user,
    body: postBody.body,
    status: postBody.status,
    images: postBody.images,
    datePosted: new Date(),
  };
  const post = await Post.create(newPost);
  await Post.populate(post, { path: "user" });
  return post;
};

/**
 * Query for post
 * @returns {Promise<QueryResult>}
 */
const queryPosts = async (filter, options) => {
  // const posts = await Post.paginate(filter, options);
  const posts = await Post.find()
    .populate("user")
    .populate("upVote")
    .populate("downVote")
    .populate("comments.user")
    .populate("comments.replies.user");
  return posts;
};

/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const getPostById = async (id) => {
  return await Post.findById(id)
    .populate("user")
    .populate("upVote")
    .populate("downVote")
    .populate("comments.user")
    .populate("comments.replies.user");
};
/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const getPostByUserId = async (id) => {
  return await Post.findOne({ user: id })
    .populate("user")
    .populate("upVote")
    .populate("downVote")
    .populate("comments.user")
    .populate("comments.replies.user");
};

const getPostsByUserId = async (userId) => {
  return await Post.find({ user: userId })
    .populate("user")
    .populate("upVote")
    .populate("downVote")
    .populate("comments.user")
    .populate("comments.replies.user");
};
/**
 * Get user by id
 * @param {ObjectId} useId
 * @returns {Promise<Post>}
 */
const getPostsOfSingleUser = async (userId) => {
  return await getPostsByUserId(userId);
};
/**
 * Get user by id
 * @param {ObjectId} useId
 * @returns {Promise<Post>}
 */
const getPostsOfLoggedUser = async (userId) => {
  return await getPostsByUserId(userId);
};
/**
 * Update post by id
 * @param {*} postId
 * @param {*} postBody
 * @returns
 */
const updatePost = async (postId, postBody) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found.");
  }
  const updatePostBody = {
    body: postBody.body,
    images: postBody.images,
    dateUpdated: new Date(),
  };
  Object.assign(post, updatePostBody);
  await post.save();
  return await getPostById(postId);
};

/**
 * Delete post by id
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const deletePost = async (id, userId) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  if (post.user.toString() !== userId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No authorize to delete this post!"
    );
  }
  await post.remove();
  return post;
};

/**
 * Post upvote post by id
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const upVotePost = async (id, userId) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  if (post.upVote.includes(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You already up vote the post!");
  }
  if (post.downVote.includes(userId)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You already down vote the post, you cannot upvote!"
    );
  }
  await post.upVote.push(userId);
  await post.save();
  return await getPostById(id);
};

/**
 * Post upvote post by id
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const removeUpVotePost = async (id, userId) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const index = post.upVote.findIndex((upvote) => upvote.toString() === userId);
  if (index < 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You have not up vote yet.");
  }
  await post.upVote.splice(index, 1);
  await post.save();
  return await getPostById(id);
};

/**
 * Post upvote post by id
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const removeDownVotePost = async (id, userId) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const index = post.downVote.findIndex(
    (downvote) => downvote.toString() === userId
  );
  if (index < 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You have not down vote yet.");
  }
  await post.downVote.splice(index, 1);
  await post.save();
  return await getPostById(id);
};

const getUpVotes = async (id) => {
  const post = await Post.findById(id).populate("upVote");
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const upvotes = post.upVote;
  return upvotes;
};
/**
 * Post downvote post by id
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const downVotePost = async (id, userId) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  if (post.downVote.includes(userId)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You already down vote the post!"
    );
  }
  if (post.upVote.includes(userId)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You already up vote the post, you cannot downvote!"
    );
  }
  await post.downVote.push(userId);
  await post.save();
  return await getPostById(id);
};

const getDownVotes = async (id) => {
  const post = await Post.findById(id).populate("downVote");
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const downvotes = post.downVote;
  return downvotes;
};
/**
 * Post Add Comment to a post
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const putComment = async (postId, userId, commentBody) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const newComment = {
    user: userId,
    text: commentBody.text,
    img: commentBody.img,
    commentCreateDate: new Date(),
  };
  await post.comments.push(newComment);
  await post.save();
  return await getPostById(postId);
};

/**
 *
 * @param {*} postId
 * @param {*} commentId
 * @param {*} userId
 * @param {*} replyBody
 * @returns
 */
const replyComment = async (postId, commentId, userId, replyBody) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const comments = post.comments;
  const commentIndex = comments.findIndex((com) => com.id === commentId);
  if (commentIndex == -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Comment found!");
  }
  const newReply = {
    user: userId,
    text: replyBody.text,
    img: replyBody.img,
    replyCreateDate: new Date(),
  };
  comments[commentIndex].replies.push(newReply);
  post.comments = comments;
  await post.save();
  return await getPostById(postId);
};

const deleteReply = async (postId, commentId, replyId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const comments = post.comments;
  const commentIndex = comments.findIndex((com) => com.id === commentId);
  if (commentIndex == -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Comment found!");
  }
  const replyIndex = comments[commentIndex].replies.findIndex(
    (reply) => reply.id === replyId
  );
  if (replyIndex == -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Reply found!");
  }
  if (String(comments[commentIndex].replies[replyIndex].user) !== userId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No Authorized to delete reply!"
    );
  }
  comments[commentIndex].replies.splice(replyIndex, 1);
  await post.save();
  return await getPostById(postId);
};

/**
 *
 * @param {*} postId
 * @param {*} commentId
 * @param {*} replyId
 * @param {*} userId
 * @returns
 */
const upVoteReply = async (postId, commentId, replyId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const comments = post.comments;
  const commentIndex = comments.findIndex((com) => com.id === commentId);
  if (commentIndex == -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Comment found!");
  }
  const replyIndex = comments[commentIndex].replies.findIndex(
    (reply) => reply.id === replyId
  );
  if (replyIndex == -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Reply found!");
  }
  if (comments[commentIndex].replies[replyIndex].upVote.includes(userId)) {
    throw new ApiError(httpStatus.NOT_FOUND, "You already upvote Reply.");
  }
  if (comments[commentIndex].replies[replyIndex].downVote.includes(userId)) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "You already downvote reply, you can not upvote."
    );
  }
  comments[commentIndex].replies[replyIndex].upVote.push(userId);
  post.comments = comments;
  await post.save();
  return await getPostById(postId);
};

/**
 *
 * @param {*} postId
 * @param {*} commentId
 * @param {*} replyId
 * @param {*} userId
 * @returns
 */
const deleteUpVoteReply = async (postId, commentId, replyId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const comments = post.comments;
  const commentIndex = comments.findIndex((com) => com.id === commentId);
  if (commentIndex == -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Comment found!");
  }
  const replyIndex = comments[commentIndex].replies.findIndex(
    (reply) => reply.id === replyId
  );
  if (replyIndex == -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Reply found!");
  }
  const upVoteIndex = comments[commentIndex].replies[
    replyIndex
  ].upVote.findIndex((up) => String(up) === userId);
  if (upVoteIndex == -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "You haven't upvote yet!");
  }
  comments[commentIndex].replies[replyIndex].upVote.splice(upVoteIndex, 1);
  post.comments = comments;
  await post.save();
  return await getPostById(postId);
};

/**
 *
 * @param {*} postId
 * @param {*} commentId
 * @param {*} replyId
 * @param {*} userId
 * @returns
 */
const downVoteReply = async (postId, commentId, replyId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const comments = post.comments;
  const commentIndex = comments.findIndex((com) => com.id === commentId);
  if (commentIndex == -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Comment found!");
  }
  const replyIndex = comments[commentIndex].replies.findIndex(
    (reply) => reply.id === replyId
  );
  if (replyIndex == -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Reply found!");
  }
  if (comments[commentIndex].replies[replyIndex].downVote.includes(userId)) {
    throw new ApiError(httpStatus.NOT_FOUND, "You already downvote Reply.");
  }
  if (comments[commentIndex].replies[replyIndex].upVote.includes(userId)) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "You already upvote reply, you can not downvote."
    );
  }
  comments[commentIndex].replies[replyIndex].downVote.push(userId);
  post.comments = comments;
  await post.save();
  return await getPostById(postId);
};

/**
 *
 * @param {*} postId
 * @param {*} commentId
 * @param {*} replyId
 * @param {*} userId
 * @returns
 */
const deleteDownVoteReply = async (postId, commentId, replyId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const comments = post.comments;
  const commentIndex = comments.findIndex((com) => com.id === commentId);
  if (commentIndex == -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Comment found!");
  }
  const replyIndex = comments[commentIndex].replies.findIndex(
    (reply) => reply.id === replyId
  );
  if (replyIndex == -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Reply found!");
  }
  const downVoteIndex = comments[commentIndex].replies[
    replyIndex
  ].downVote.findIndex((up) => String(up) === userId);
  if (downVoteIndex == -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "You haven't downvote yet!");
  }
  comments[commentIndex].replies[replyIndex].downVote.splice(downVoteIndex, 1);
  post.comments = comments;
  await post.save();
  return await getPostById(postId);
};
/**
 *
 * @param {*} postId
 * @param {*} userId
 * @returns
 */
const getComments = async (postId, userId) => {
  const post = await Post.findById(postId)
    .populate("comments.user")
    .populate("comments.replies.user");
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const comments = post.comments;
  return comments;
};
/**
 * Post Add Comment to a post
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const deleteComment = async (postId, userId, commentId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const comment = post.comments.find((comment) => comment.id === commentId);
  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Comment not found!");
  }
  if (comment.user.toString() !== userId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Not authorize to delete comment."
    );
  }
  post.comments = post.comments.filter(({ id }) => id !== commentId);
  await post.save();
  return await getPostById(postId);
};

/**
 * Post upVote Comment of a post
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const upVoteComment = async (postId, userId, commentId) => {
  console.log(commentId);
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const comment = post.comments.find((comment) => comment.id === commentId);
  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Comment not found!");
  }
  if (comment.upVote.includes(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Comment already up voted!");
  }
  if (comment.downVote.includes(userId)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Comment already down voted comment you cannot upvote!"
    );
  }
  comment.upVote.push(userId);
  post.comments.forEach((com) => {
    if (com.id === comment.id) {
      com = comment;
    }
  });
  await post.save();
  return await getPostById(postId);
};

/**
 * Post Remove up Vote Comment of a post
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const removeUpVoteComment = async (postId, userId, commentId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const comment = post.comments.find((comment) => comment.id === commentId);
  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Comment not found!");
  }
  const index = comment.upVote.findIndex(
    (upvote) => upvote.toString() === userId
  );
  if (index < 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have not upvote this comment yet."
    );
  }
  comment.upVote.splice(index, 1);
  post.comments.forEach((com) => {
    if (com.id === comment.id) {
      com = comment;
    }
  });
  await post.save();
  return await getPostById(postId);
};

/**
 * Post Remove down Vote Comment of a post
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const removeDownVoteComment = async (postId, userId, commentId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const comment = post.comments.find((comment) => comment.id === commentId);
  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Comment not found!");
  }
  const index = comment.downVote.findIndex(
    (downvote) => downvote.toString() === userId
  );
  if (index < 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have not down vote this comment yet."
    );
  }
  comment.downVote.splice(index, 1);
  post.comments.forEach((com) => {
    if (com.id === comment.id) {
      com = comment;
    }
  });
  await post.save();
  return await getPostById(postId);
};
/**
 * Post downVote Comment of a post
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const downVoteComment = async (postId, userId, commentId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No post found");
  }
  const comment = post.comments.find((comment) => comment.id === commentId);
  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Comment not found!");
  }
  if (comment.downVote.includes(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Comment already down voted!");
  }
  if (comment.upVote.includes(userId)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Comment already up voted comment you cannot downvote!"
    );
  }
  comment.downVote.push(userId);
  post.comments.forEach((com) => {
    if (com.id === comment.id) {
      com = comment;
    }
  });
  await post.save();
  return await getPostById(postId);
};
module.exports = {
  createPost,
  queryPosts,
  getPostByUserId,
  getPostById,
  getPostsOfLoggedUser,
  getPostsOfSingleUser,
  updatePost,
  deletePost,
  upVotePost,
  removeUpVotePost,
  downVotePost,
  removeDownVotePost,
  putComment,
  deleteComment,
  upVoteComment,
  removeUpVoteComment,
  downVoteComment,
  removeDownVoteComment,
  getComments,
  getUpVotes,
  getDownVotes,
  replyComment,
  deleteReply,
  upVoteReply,
  deleteUpVoteReply,
  downVoteReply,
  deleteDownVoteReply,
};
