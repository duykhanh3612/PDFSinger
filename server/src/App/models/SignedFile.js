const mongoose = require('mongoose');

const SignedFileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const SignedFile = mongoose.model('SignedFile', SignedFileSchema);

module.exports = SignedFile;
