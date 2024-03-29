const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Key = require('../models/key');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const SignedFile = require('../models/SignedFile');
const path = require('path');



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
        console.log(decryptedPrivateKey)
        // Băm dữ liệu PDF
        const fileHash = calculateFileHash(fileBuffer);
        
        // Tạo chữ ký số cho giá trị băm
        const signer = crypto.createSign('sha256');
        signer.update(fileHash);
        const signature = signer.sign(decryptedPrivateKey, 'base64');

        return { signature, fileHash }; // Trả về cả chữ ký số và giá trị băm
    } catch (error) {
        console.error('Lỗi khi ký file PDF:', error);
        throw error;
    }
}


// Hàm để xử lý ký văn bản PDF
async function handlePdfSigning(req, res) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ error: "Token không được cung cấp" });
    }

    if (!token.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Định dạng token không hợp lệ" });
    }

    const tokenValue = token.slice(7);
    const secretKey = req.app.get("secretKey");

    const { keyId, password } = req.body;
    const { file: pdfFile } = req;

    try {
        const decodedToken = jwt.verify(tokenValue, secretKey);
        const userId = decodedToken.userId;
        
        // Đọc nội dung của file PDF
        const pdfContent = fs.readFileSync(pdfFile.path);
        
        // Ký văn bản PDF bằng private key
        const { signature, fileHash } = await signPdfWithPrivateKey(pdfContent, keyId, password);

        // Lưu file đã ký vào cơ sở dữ liệu
        const signedFileName = pdfFile.originalname; // Tên file đã ký với phần mở rộng .pdf
        const signedFilePath = path.join(__dirname, 'signed_files', signedFileName);

        // Kiểm tra nếu thư mục 'signed_files' chưa tồn tại, hãy tạo nó
        const signedFilesDir = path.join(__dirname, 'signed_files');
        if (!fs.existsSync(signedFilesDir)) {
            fs.mkdirSync(signedFilesDir);
        }

        const signedFile = new SignedFile({
            userId: userId,
            fileName: signedFileName,
            fileHash: fileHash,
            signature: signature,
            filePath: signedFilePath,
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

async function verifyPdfSignature(pdfContent, publicKey, signature) {
    try {
        // Tạo đối tượng xác thực
        const verifier = crypto.createVerify('sha256');
        
        // Tạo giá trị băm của nội dung tệp PDF
        const fileHash = calculateFileHash(pdfContent);
        
        // Cập nhật đối tượng xác thực với giá trị băm
        verifier.update(fileHash);
        
        // Xác thực chữ ký với khóa công khai
        const isVerified = verifier.verify(publicKey, signature, 'base64');
        
        return isVerified;
    } catch (error) {
        console.error('Lỗi khi xác thực chữ ký:', error);
        return false;
    }
}


async function handlePdfVerification(req, res) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ error: "Token không được cung cấp" });
    }

    if (!token.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Định dạng token không hợp lệ" });
    }

    const tokenValue = token.slice(7);
    const secretKey = req.app.get("secretKey");
    const { keyId } = req.body;
    const { file: pdfFile } = req;
    try {
        // Kiểm tra xem keyId có tồn tại không
        const key = await Key.findById(keyId);
        if (!key) {
            return res.status(404).json({ error: "Không tìm thấy khóa" });
        }

        // Lấy tên file mà không có phần mở rộng .pdf
        const pdfName = pdfFile.originalname.replace('.pdf', '');

        // Tìm file đã ký trong cơ sở dữ liệu
        const signedFile = await SignedFile.findById(pdfName);
        if (!signedFile) {
            return res.status(404).json({ error: "Không tìm thấy tệp đã ký" });
        }

        // Đọc nội dung của file PDF đã ký
        const pdfContent = fs.readFileSync(pdfFile.path);

        // Xác thực chữ ký
        const verified = await verifyPdfSignature(pdfContent, key.publicKey, signedFile.signature);

        if (verified) {
            return res.status(200).json({ verified: true });
        } else {
            return res.status(500).json({ verified: false });
        }
    } catch (error) {
        console.error('Lỗi khi xác nhận file đã ký:', error);
        // Kiểm tra nếu lỗi là do CastError
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'file không hợp lệ !' });
        }
        return res.status(500).json({ error: 'Không thể xác nhận file đã ký' });
    }
}




module.exports = {
    handlePdfVerification,
    handlePdfSigning
};
