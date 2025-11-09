import User from "../models/UserModel.js";

// ✅ GET /api/users/profile – Lấy thông tin người dùng hiện tại
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (error) {
    console.error("Lỗi khi lấy profile:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin người dùng" });
  }
};

// ✅ GET /api/users – Dành cho admin và moderator
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách người dùng" });
  }
};

// ✅ DELETE /api/users/:id – Admin hoặc chính chủ
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    // Admin hoặc chính chủ hoặc moderator có quyền xóa user
    if (
      req.user.role === "admin" ||
      req.user.role === "moderator" ||
      req.user._id.equals(user._id)
    ) {
      await user.deleteOne();
      res.json({ message: "Đã xóa user thành công" });
    } else {
      res.status(403).json({ message: "Không có quyền xóa user này" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi xóa người dùng" });
  }
};
