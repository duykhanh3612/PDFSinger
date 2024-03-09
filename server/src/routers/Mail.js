var express = require("express");
const router = express.Router();

const mail = require("../App/controllers/Mail.js");

router.post("/send-code", mail.sendMail);

module.exports = router;
