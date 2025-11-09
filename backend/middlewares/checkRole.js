// Middleware kiểm tra quyền truy cập
export const checkRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Chưa xác thực!" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Không có quyền truy cập!" });
      }

      next();
    } catch (error) {
      console.error("Lỗi kiểm tra quyền:", error);
      res.status(500).json({ message: "Lỗi server khi kiểm tra quyền!" });
    }
  };
};
