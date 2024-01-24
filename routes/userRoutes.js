const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// ------------------ Routes -------------------

router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.login);
router.route("/logout").post(authController.logout);
router.route("/session").get(authController.protect , authController.checkSession);

module.exports = router;
