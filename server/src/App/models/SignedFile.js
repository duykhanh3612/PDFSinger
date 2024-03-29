const mongoose = require('mongoose');

const signedFileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileHash: {
        type: String,
        required: true
    },
    signature: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    }
});

const SignedFile = mongoose.model('SignedFile', signedFileSchema);

module.exports = SignedFile;
