const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const { validationCreateUser } = require("../../../helpers/validator");

router.post("/signup", validationCreateUser, ctrl.signup);
router.post("/login", validationCreateUser, ctrl.login);
router.post("/logout", guard, ctrl.logout);
router.post("/current", guard, ctrl.current);

module.exports = router;
