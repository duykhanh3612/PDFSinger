var express = require("express");
const router = express.Router();

const Key = require("../App/controllers/keyController");

// router.post("/keys", Key.getkeys);
router.post("/create", Key.createKey);
router.post("/dec", Key.decryptKey);
router.get("/getsig", Key.getAllSignaturesByUserId);

module.exports = router;
