var express = require("express");
const router = express.Router();

const User = require("../App/controllers/userController");

router.post("/login", User.login);
router.post("/register", User.register);
module.exports = router;
