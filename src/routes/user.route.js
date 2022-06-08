const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const userValidation = require("../validations/user.validation");
const userController = require("../controllers/user.controller");
const { fileUpload } = require("../utils/fileUpload");
const router = express.Router();

router
  .route("/")
  .post(
    [
      auth("manageUsers"),
      (validate(userValidation.createUser), fileUpload.single("photoPath")),
    ],
    userController.createUser
  )
  .get(auth("manageUsers"), userController.getUsers);

router
  .route("/:userId")
  .get(
    auth(),
    validate(userValidation.getUser),
    userController.getUser
  )
  .patch(
    auth(),
    fileUpload.single("photoPath"),
    userController.updateUser
  )
  .delete(
    auth("manageUsers"),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

// router
//   .route('/deviceToken')
//   .post(auth('manageUsers'), validate(userValidation.deviceToken), userController.addDeviceTokenInReviewer);

module.exports = router;
