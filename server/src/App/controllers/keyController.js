const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Key = require('../models/key');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const SignedFile = require('../models/SignedFile');

// Hàm kiểm tra dữ liệu đầu vào
function validateInput(title, encryptionType, password, confirmPassword) {
    if (!title || typeof title !== 'string') {
        return "Tiêu đề không được cung cấp hoặc không hợp lệ";
    }
    if (!encryptionType || !["RSA", "DSA", "ECC"].includes(encryptionType)) {
        return "Loại mã hóa không hợp lệ";
    }
    if (!password || typeof password !== 'string') {
        return "Mật khẩu không được cung cấp hoặc không hợp lệ";
    }
    if (password !== confirmPassword) {
        return "Mật khẩu và mật khẩu xác nhận không khớp";
    }
    return null; // Dữ liệu đầu vào hợp lệ
}

// Hàm tạo mới một khóa
async function createKey(req, res) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ error: "Token không được cung cấp" });
    }

    if (!token.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Định dạng token không hợp lệ" });
    }

    const tokenValue = token.slice(7);
    const secretKey = req.app.get("secretKey");

    try {
        const decodedToken = jwt.verify(tokenValue, secretKey);
        const userId = decodedToken.userId;

        const { title, encryptionType, password, confirmPassword, expires_at } = req.body;
        const inputError = validateInput(title, encryptionType, password, confirmPassword);
        if (inputError) {
            return res.status(400).json({ error: inputError });
        }

        let privateKey;
        let publicKey;

        // Tạo cặp khóa dựa trên loại mã hóa được yêu cầu
        switch (encryptionType) {
            case "RSA": {
                const { privateKey: rsaPrivateKey, publicKey: rsaPublicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem'
                    }
                });
                privateKey = rsaPrivateKey;
                publicKey = rsaPublicKey;
                break;
            }
            case "DSA": {
                const { privateKey: dsaPrivateKey, publicKey: dsaPublicKey } = crypto.generateKeyPairSync('dsa', {
                    modulusLength: 2048,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem'
                    }
                });
                privateKey = dsaPrivateKey;
                publicKey = dsaPublicKey;
                break;
            }
            case "ECC": {
                const { privateKey: eccPrivateKey, publicKey: eccPublicKey } = crypto.generateKeyPairSync('ec', {
                    namedCurve: 'secp256k1',
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'sec1',
                        format: 'pem'
                    }
                });
                privateKey = eccPrivateKey;
                publicKey = eccPublicKey;
                break;
            }
            default:
                return res.status(400).json({ error: "Loại mã hóa không hợp lệ" });
        }

        // Tạo salt mới
        const salt = await bcrypt.genSalt(10);        // Băm mật khẩu

        const passwordHash = await bcrypt.hash(password, 10);
        const iv = crypto.randomBytes(16);
        // console.log(privateKey);
        // Mã hóa khóa private
        const encryptedPrivateKey = encrypt(privateKey, password, salt, iv); 

        // Lưu dữ liệu khóa
        const newKey = new Key({
            title,
            userId,
            encryptionType,
            password: passwordHash,
            publicKey: publicKey.toString('base64'),
            privateKey: encryptedPrivateKey,
            salt: salt, // Lưu salt vào cơ sở dữ liệu
            iv: iv.toString('base64') // Lưu IV dưới dạng base64 để có thể lưu trữ và sử dụng sau này
        });

        await newKey.save();

        res.status(201).json({ message: 'Tạo khóa thành công' });
    } catch (error) {
        console.error('Lỗi khi tạo khóa:', error);
        res.status(500).json({ message: 'Không thể tạo khóa' });
    }
}
async function decryptKey(req, res) {
    const { keyId, password } = req.body;

    // Kiểm tra xác thực token và xử lý lỗi nếu cần thiết

    try {
        // Lấy thông tin khóa từ cơ sở dữ liệu dựa trên id_key
        const key = await Key.findById(keyId);

        if (!key) {
            return res.status(404).json({ error: "Không tìm thấy khóa" });
        }

        // So sánh mật khẩu đã cung cấp với mật khẩu đã băm trong cơ sở dữ liệu
        const isPasswordCorrect = await bcrypt.compare(password, key.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Mật khẩu không đúng" });
        }

        // Giải mã private key
        const decryptedPrivateKey = decrypt(key.privateKey, password, key.salt, key.iv);

        res.status(200).json({ decryptedPrivateKey });
    } catch (error) {
        console.error('Lỗi khi giải mã khóa:', error);
        res.status(500).json({ error: 'Không thể giải mã khóa' });
    }
}



function decrypt(data, password, saltBase64, ivBase64) {
    const salt = Buffer.from(saltBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');    const key = crypto.scryptSync(password, salt, 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(data, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function encrypt(privateKey, password, saltBase64, ivBase64) {
    const salt = Buffer.from(saltBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');    const key = crypto.scryptSync(password, salt, 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(privateKey, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}


async function getAllSignaturesByUserId(req, res) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ error: "Token không được cung cấp" });
    }

    if (!token.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Định dạng token không hợp lệ" });
    }

    const tokenValue = token.slice(7);
    const secretKey = req.app.get("secretKey");

    try {
        const decodedToken = jwt.verify(tokenValue, secretKey);
        const userId = decodedToken.userId;

        // Find all signatures created by the user
        const signatures = await Key.find({ userId: userId });

        // Extract signature names from the signatures
        const signatureNames = signatures.map(signature => signature.title);

        // Respond with the list of signature names
        res.status(200).json({ signatureNames: signatureNames });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách chữ ký:', error);
        res.status(500).json({ message: 'Không thể lấy danh sách chữ ký' });
    }
}


module.exports = {
    createKey,
    decryptKey,
    getAllSignaturesByUserId,
    
};
