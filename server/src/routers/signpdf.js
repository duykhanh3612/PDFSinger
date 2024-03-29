const express = require("express");
const router = express.Router();
const multer = require("multer");

const sig = require("../App/controllers/signPDFController");

// Cấu hình Multer chỉ cho endpoint `/sign`
const upload = multer({ dest: 'uploads/' }); // Thư mục đích cho các tệp tải lên

// Endpoint xử lý tệp được tải lên
router.post("/sign", upload.single('file'), sig.handlePdfSigning);
router.post("/verifysign", upload.single('file'), sig.handlePdfVerification);

module.exports = router;
