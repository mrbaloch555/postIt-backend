const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const profileValidation = require("../validations/profile.validation");
const { profileController } = require("../controllers/index");
const router = express.Router();

router.route("/").get(auth(), profileController.getProfiles);

router
  .route("/:id")
  .get(
    auth(),
    validate(profileValidation.getProfile),
    profileController.getProfile
  )
  .patch(
    auth(),
    validate(profileValidation.updateProfile),
    profileController.updateProfile
  );

router
  .route("/follow")
  .post(
    auth(),
    validate(profileValidation.followUser),
    profileController.followUser
  );

router
  .route("/unfollow")
  .post(
    auth(),
    validate(profileValidation.unfollowUser),
    profileController.unfollowUser
  );
module.exports = router;
