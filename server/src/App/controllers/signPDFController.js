const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Key = require('../models/key');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const SignedFile = require('../models/SignedFile');



function decrypt(data, password, saltBase64, ivBase64) {
    const salt = Buffer.from(saltBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');    const key = crypto.scryptSync(password, salt, 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(data, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


function calculateFileHash(fileBuffer) {
    const hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    return hash.digest('hex');
}

// Hàm để ký file bằng private key
async function signPdfWithPrivateKey(fileBuffer, keyId, password) {
    try {
        const key = await Key.findById(keyId);
        if (!key) {
            throw new Error("Không tìm thấy khóa");
        }

        const decryptedPrivateKey = decrypt(key.privateKey, password, key.salt, key.iv);
        const signature = SignedFile(fileBuffer, decryptedPrivateKey);

        return signature;
    } catch (error) {
        console.error('Lỗi khi ký file PDF:', error);
        throw error;
    }
}

// Hàm để xử lý ký văn bản PDF
async function handlePdfSigning(req, res) {
    const { keyId, password } = req.body;
    const { file: pdfFile } = req;

    try {
        // Đọc nội dung của file PDF
        const pdfContent = fs.readFileSync(pdfFile.path);
        
        // Ký văn bản PDF bằng private key
        const signature = await signPdfWithPrivateKey(pdfContent, keyId, password);

        // Tính toán giá trị băm của file
        const fileHash = calculateFileHash(pdfContent);

        // Lưu file đã ký vào cơ sở dữ liệu
        const signedFile = new SignedFile({
            userId: "6605328eff6c8eb1f9e798e7",
            fileName: pdfFile.originalname,
            fileHash: fileHash,
            signature: signature,
            filePath: pdfFile.path,
        });
        await signedFile.save();



        // Trả về link để tải file đã ký
        const downloadLink = `/download/${signedFile._id}`;
        res.status(200).json({ downloadLink: downloadLink });
        } catch (error) {
        console.error('Lỗi khi xử lý ký PDF:', error);
        res.status(500).json({ error: 'Không thể ký PDF' });
        }
}
module.exports = {

    handlePdfSigning
};
