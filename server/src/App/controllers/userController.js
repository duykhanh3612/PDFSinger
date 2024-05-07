// controllers/userController.js

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  console.log("Join to register");
  try {
    const { email, username, password, confirmPassword } = req.body;

    console.log(req.body);

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Kiểm tra mật khẩu và nhập lại mật khẩu
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailOrUsername = email;

    console.log(req.body);
    console.log("Request Body:", req.body);
    if (!emailOrUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Email or username is required" });
    }

    // Convert emailOrUsername to lowercase for case-insensitive search
    const lowercasedEmailOrUsername = emailOrUsername.toLowerCase();

    // Tìm người dùng bằng email hoặc username (case-insensitive)
    const user = await User.findOne({
      $or: [
        { email: lowercasedEmailOrUsername },
        { username: lowercasedEmailOrUsername },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password",
      });
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password",
      });
    }

    const secretKey = req.app.get("secretKey");
    // Tạo token
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "3d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { register, login };
