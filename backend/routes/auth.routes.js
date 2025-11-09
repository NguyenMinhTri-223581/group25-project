import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  uploadAvatar,
  refreshAccessToken,
  logout,
} from "../controllers/authController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import upload, { handleUploadError } from "../middlewares/upload.js";
import { loginLimiter } from "../middlewares/rateLimitMiddleware.js";
import { logActivity } from "../middlewares/logMiddleware.js";
import Log from "../models/logModel.js";


const router = express.Router();

// 🟢 Đăng ký & Đăng nhập (thêm limiter + log)
router.post("/signup", logActivity, register);
router.post("/login", loginLimiter, logActivity, login);

// 🟢 Quên mật khẩu & Đặt lại mật khẩu
router.post("/forgot-password", logActivity, forgotPassword);
router.post("/reset-password/:token", logActivity, resetPassword);

// 🟢 Upload avatar
router.post(
  "/upload-avatar",
  verifyToken,
  upload.single("avatar"),
  handleUploadError,
  logActivity,
  uploadAvatar
);

// 🟢 Refresh Token & Logout
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);

router.get("/logs", async (req, res) => {
  const logs = await Log.find().populate("userId", "email name");
  res.json(logs);
});

export default router;
