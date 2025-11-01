import User from "../models/userModel.js";

// GET /users – Admin
export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// DELETE /users/:id – Admin hoặc chính chủ
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

  // Admin hoặc chính chủ mới được xóa
  if (req.user.role === "admin" || req.user._id.equals(user._id)) {
    await user.deleteOne();
    res.json({ message: "Đã xóa user thành công" });
  } else {
    res.status(403).json({ message: "Không có quyền xóa user này" });
  }
};
