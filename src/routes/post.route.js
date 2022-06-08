const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { postValidation } = require("../validations/index");
const { postController } = require("../controllers/index");
const { fileUpload } = require("../utils/fileUpload");
const router = express.Router();

router
  .route("/")
  .post(
    auth(),
    [fileUpload.array("photoPath"), validate(postValidation.createPost)],
    postController.createPost
  )
  .get(auth(), postController.getPosts);

router
  .route("/:id")
  .get(auth(), validate(postValidation.getPost), postController.getPost)
  .patch(
    auth(),
    [fileUpload.array("photoPath"), validate(postValidation.updatePost)],
    postController.updatPost
  )
  .delete(
    auth(),
    validate(postValidation.deletePost),
    postController.deletePost
  );
router
  .route("/user/logged-user")
  .get(auth(), postController.getPostsOfLoggedUser);
router
  .route("/user-post/:id")
  .get(
    auth(),
    validate(postValidation.getPostsOfSingleUser),
    postController.getPostsOfSingleUser
  );

router
  .route("/upvote/:id")
  .post(auth(), validate(postValidation.upVote), postController.upVotePost)
  .get(auth(), validate(postValidation.upVote), postController.getUpVotes);
router
  .route("/downvote/:id")
  .post(auth(), validate(postValidation.downVote), postController.downVotePost)
  .get(auth(), validate(postValidation.downVote), postController.getDownVotes);

router
  .route("/upvote-remove/:id")
  .post(
    auth(),
    validate(postValidation.upVote),
    postController.removeUpVotePost
  );
router
  .route("/downvote-remove/:id")
  .post(
    auth(),
    validate(postValidation.downVote),
    postController.removeDownVotePost
  );

router
  .route("/comment/:id")
  .post(
    auth(),
    fileUpload.single("photoPath"),
    validate(postValidation.putComment),
    postController.putComment
  )
  .get(
    auth(),
    validate(postValidation.getComments),
    postController.getComments
  );

router
  .route("/comment/:id/:commentId")
  .post(
    auth(),
    fileUpload.single("photoPath"),
    validate(postValidation.replyComment),
    postController.replyComment
  );
router
  .route("/comment/:id/:commentId/:replyId")
  .delete(
    auth(),
    validate(postValidation.deleteReply),
    postController.deleteReply
  );

router
  .route("/comment/:id/:comment_id")
  .delete(
    auth(),
    validate(postValidation.deleteComment),
    postController.deleteComment
  );

router
  .route("/comment/:id/:commentId/up-vote/:replyId")
  .post(
    auth(),
    validate(postValidation.upVoteReply),
    postController.upVoteReply
  )
  .delete(
    auth(),
    validate(postValidation.upVoteReply),
    postController.deleteUpVoteReply
  );

router
  .route("/comment/:id/:commentId/down-vote/:replyId")
  .post(
    auth(),
    validate(postValidation.upVoteReply),
    postController.downVoteReply
  )
  .delete(
    auth(),
    validate(postValidation.upVoteReply),
    postController.deleteDownVoteReply
  );

router
  .route("/comment/:id/upvote/:comment_id")
  .post(
    auth(),
    validate(postValidation.upvoteComment),
    postController.upVoteComment
  );

router
  .route("/comment/:id/upvote-remove/:comment_id")
  .post(
    auth(),
    validate(postValidation.upvoteComment),
    postController.removeUpVoteComment
  );

router
  .route("/comment/:id/downvote-remove/:comment_id")
  .post(
    auth(),
    validate(postValidation.downvoteComment),
    postController.removeDownVoteComment
  );

router
  .route("/comment/:id/downvote/:comment_id")
  .post(
    auth(),
    validate(postValidation.downvoteComment),
    postController.downVoteComment
  );
module.exports = router;
