const express = require("express");
const app = express();
const port = 3003;
const mongoose = require("mongoose");
const route = require("./src/routers");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import thư viện CORS
const db = require("./src/config/db");
const crypto = require("crypto");
db.connect();

// Sử dụng middleware CORS
app.use(cors());

app.use(bodyParser.json());

// Tạo secret key khi server khởi động
const secretKey = "7794c4d8a6614764d5450b86349c731aff92f896b1091b4296e319786e6139eb"
// crypto.randomBytes(32).toString("hex");

// Sử dụng secret key trong toàn bộ ứng dụng
app.set("secretKey", secretKey);
console.log(secretKey);

app.get("/trang-chu", (req, res) => {
  return res.send("Hello World!");
});

route(app);

app.listen(port, () => console.log("Example app listening at localhost port"));
