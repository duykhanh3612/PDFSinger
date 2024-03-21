const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // For password hashing

const keySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // Store user reference for ownership (replace with your user model reference)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  encryptionType: {
    type: String,
    required: true,
  },
  // Separate fields for public and private keys (if applicable)
  publicKey: {
    type: String,
  },
  privateKey: {
    type: String,
    required: true,
  },
  // Hashed password for additional security (optional)
  password: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  iv: {
    type: String,
  },
  salt: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  expires_at: {
    type: Date,
    required: false,
  },
});

// // Hash password before saving the key
// keySchema.pre("save", async function (next) {
//   if (this.password) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

const Key = mongoose.model("Key", keySchema);

module.exports = Key;
