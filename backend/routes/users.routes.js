import express from "express";
import {
  getUserProfile,
  getUsers,
  deleteUser
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Lấy thông tin người dùng hiện tại
 * @access  Private (cần token)
 */
router.get("/profile", verifyToken, getUserProfile);

/**
 * @route   GET /api/users
 * @desc    Lấy danh sách tất cả người dùng (chỉ admin)
 * @access  Private/Admin
 */
router.get("/", verifyToken, isAdmin, getUsers);

/**
 * @route   DELETE /api/users/:id
 * @desc    Xóa người dùng theo ID (admin hoặc chính chủ)
 * @access  Private/Admin/User
 */
router.delete("/:id", verifyToken, deleteUser);

export default router;


