const express = require('express');
const router = express.Router();
const SignedFile = require('../App/models/SignedFile');
const path = require("path");
// Route để tải file đã ký

router.get("/:id", async (req, res) => {
    try {
        const signedFile = await SignedFile.findById(req.params.id);
        if (!signedFile) {
            return res.status(404).json({ error: "File đã ký không tồn tại" });
        }
        
        // Chuyển đổi đường dẫn tương đối thành đường dẫn tuyệt đối
        const absolutePath = path.resolve(signedFile.filePath);
        
        // Trả về file đã ký
        res.sendFile(absolutePath);
    } catch (error) {
        console.error('Lỗi khi tải file đã ký:', error);
        res.status(500).json({ error: 'Không thể tải file đã ký' });
    }
});

module.exports = router;
