const express = require("express");
const router = express.Router();
const authController = require("../../controller/auth.controller");
const userController = require("../../controller/user.controller");
const auth = require("../../middleware/auth");
const { authValidator } = require("../../validators");
const validate = require("../../middleware/validator");

router.post("/register", validate(authValidator.register), authController.register);
router.post("/login", validate(authValidator.login), authController.login);
// router.post('/logout', auth, authController.logout);

module.exports = router;
