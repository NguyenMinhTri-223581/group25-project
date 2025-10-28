// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// 🧩 ĐĂNG KÝ NGƯỜI DÙNG
// ===============================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra thông tin nhập vào
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Đăng ký thành công!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi đăng ký:", err.message);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// ===============================
// 🔑 ĐĂNG NHẬP NGƯỜI DÙNG
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu
    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
    }

    // Kiểm tra người dùng có tồn tại
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err.message);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// ===============================
// 👤 LẤY THÔNG TIN NGƯỜI DÙNG (YÊU CẦU TOKEN)
// ===============================
exports.getUserInfo = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Lấy Bearer token

    if (!token) {
      return res.status(401).json({ message: "Không có token xác thực" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }
};

