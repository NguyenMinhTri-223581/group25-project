const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Đăng ký
router.post("/register", authController.register);

// Đăng nhập
router.post("/login", authController.login);

// Lấy thông tin người dùng (cần token)
router.get("/me", authController.getUserInfo);

module.exports = router;
