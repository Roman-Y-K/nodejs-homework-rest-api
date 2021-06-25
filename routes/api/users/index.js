const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const {
  validationCreateUser,
  validateVerificationUser,
} = require("../../../helpers/validator");
const upload = require("../../../helpers/upload");

router.post("/signup", validationCreateUser, ctrl.signup);
router.post("/login", validationCreateUser, ctrl.login);
router.post("/logout", guard, ctrl.logout);
router.post("/current", guard, ctrl.current);
router.patch("/avatars", guard, upload.single("avatar"), ctrl.avatars);
router.get("/verify/:verificationToken", ctrl.verification);
router.post("/verify", validateVerificationUser, ctrl.repeatVerification);

module.exports = router;
