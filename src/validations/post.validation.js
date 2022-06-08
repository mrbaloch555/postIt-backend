const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createPost = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    status: Joi.string().required(),
  }),
};

const getPost = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const getPostsOfSingleUser = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updatePost = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    title: Joi.string().allow().optional(),
    body: Joi.string().allow().optional(),
    status: Joi.string().allow().optional(),
    images: Joi.array().allow().optional(),
    upVote: Joi.array().allow().optional(),
    downVote: Joi.array().allow().optional(),
    comments: Joi.array().allow().optional(),
    datePosted: Joi.date().allow().optional(),
    dateUpdated: Joi.date().allow().optional(),
  }),
};

const deletePost = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const upVote = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};
const downVote = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const putComment = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    text: Joi.string().required(),
  }),
};

const replyComment = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
    commentId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    text: Joi.string().required(),
  }),
};
const deleteReply = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
    commentId: Joi.string().custom(objectId),
    replyId: Joi.string().custom(objectId),
  }),
};

const upVoteReply = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
    commentId: Joi.string().custom(objectId),
    replyId: Joi.string().custom(objectId),
  }),
};
const getComments = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};
const deleteComment = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
    comment_id: Joi.string().custom(objectId),
  }),
};

const upvoteComment = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
    comment_id: Joi.string().custom(objectId),
  }),
};

const downvoteComment = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
    comment_id: Joi.string().custom(objectId),
  }),
};
module.exports = {
  createPost,
  getPost,
  getPostsOfSingleUser,
  updatePost,
  deletePost,
  upVote,
  downVote,
  putComment,
  deleteComment,
  upvoteComment,
  downvoteComment,
  getComments,
  replyComment,
  deleteReply,
  upVoteReply,
};
