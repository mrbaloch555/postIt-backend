const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const replySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      trime: true,
    },

    img: {
      type: String,
    },
    upVote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downVote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replyCreateDate: {
      type: Date,
      default: new Date(),
    },
    replyUpdateDate: {
      type: Date,
      default: new Date(),
    },
  },
  { _id: true }
);
const commentsSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      trime: true,
    },

    img: {
      type: String,
    },
    upVote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downVote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: {
      type: [replySchema],
      default: [],
    },
    commentCreateDate: {
      type: Date,
      default: new Date(),
    },
    commentUpdateDate: {
      type: Date,
      default: new Date(),
    },
  },
  { _id: true }
);

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trime: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      trime: true,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    upVote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    downVote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    comments: [commentsSchema],
    datePosted: {
      type: Date,
      default: new Date(),
    },
    dateUpdated: {
      type: Date,
      default: new Date(),
    },
  },

  {
    timestamps: true,
  }
);

postSchema.plugin(toJSON);
postSchema.plugin(paginate);
/**
 * @typedef Post
 */
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
