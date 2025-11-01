import express from "express";
import { getUsers, deleteUser } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";  // middleware xác thực
import { isAdmin } from "../middlewares/roleMiddleware.js";  // middleware kiểm tra quyền admin
import User from "../models/userModel.js"; // để dùng trong /me

const router = express.Router();

/**
 * @route GET /users/me
 * @desc Lấy thông tin user hiện tại (dựa theo token)
 * @access Private (đã đăng nhập)
 */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // bỏ password
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route GET /users
 * @desc Chỉ admin được xem tất cả user
 * @access Admin
 */
router.get("/", protect, isAdmin, getUsers);

/**
 * @route DELETE /users/:id
 * @desc Admin hoặc chính chủ được xóa user
 * @access Private
 */
router.delete("/:id", protect, deleteUser);

export default router;

