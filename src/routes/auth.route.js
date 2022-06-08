const express = require("express");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/auth.validation");
const { authController } = require("../controllers/index");
const { fileUpload } = require("../utils/fileUpload");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post(
  "/register",
  [fileUpload.single("photoPath"), validate(authValidation.register)],
  authController.register
);
router.post("/login", validate(authValidation.login), authController.login);
router.post("/logout", validate(authValidation.logout), authController.logout);
router.post(
  "/change-password",
  validate(authValidation.changePassword),
  authController.changePassword
);
module.exports = router;
