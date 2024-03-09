// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Thêm các trường khác nếu cần
});

const User = mongoose.model("User", userSchema);

module.exports = User;
