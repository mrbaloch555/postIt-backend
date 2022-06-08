const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { adminValidation } = require("../validations/");
const { adminController } = require("../controllers");
const router = express.Router();

router
  .route("/")
  .post(
    auth("manageAdmins"),
    validate(adminValidation.createAdmin),
    adminController.createAdmin
  )
  .get(auth("manageAdmins"), adminController.getAdmins);

router
  .route("/:id")
  .get(
    auth("manageAdmins"),
    validate(adminValidation.getAdmin),
    adminController.getAdmin
  )
  .patch(
    auth("manageAdmins"),
    validate(adminValidation.updateAdmin),
    adminController.updateAdmin
  )
  .delete(
    auth("manageAdmins"),
    validate(adminValidation.deleteAdmin),
    adminController.deleteAdmin
  );

router.post("/login", validate(adminValidation.login), adminController.login);
router.post(
  "/logout",
  validate(adminValidation.logout),
  adminController.logout
);
module.exports = router;
