// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware xác thực người dùng qua token
exports.protect = async (req, res, next) => {
  let token;

  // Lấy token từ header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user từ token
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
  }
};
