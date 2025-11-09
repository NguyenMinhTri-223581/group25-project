import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const verifyToken = async (req, res, next) => {
  let token;

  // Kiểm tra header có chứa Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Giải mã token bằng secret trong .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy user từ DB và gán vào req.user (trừ password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      next();
    } catch (error) {
      console.error("❌ Lỗi xác thực token:", error.message);
      return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
  } else {
    return res.status(401).json({ message: "Chưa đăng nhập hoặc thiếu token" });
  }
};


