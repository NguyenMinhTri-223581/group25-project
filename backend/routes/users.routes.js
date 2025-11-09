import express from "express";
import { getUserProfile, getUsers, deleteUser } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Lấy thông tin người dùng hiện tại
 * @access  Private (user, moderator, admin)
 */
router.get("/profile", verifyToken, getUserProfile);

/**
 * @route   GET /api/users
 * @desc    Lấy danh sách tất cả người dùng (admin & moderator)
 * @access  Private
 */
router.get("/", verifyToken, checkRole(["admin", "moderator"]), getUsers);

/**
 * @route   DELETE /api/users/:id
 * @desc    Xóa người dùng theo ID (admin, moderator hoặc chính chủ)
 * @access  Private
 */
router.delete("/:id", verifyToken, checkRole(["admin", "moderator", "user"]), deleteUser);

export default router;


