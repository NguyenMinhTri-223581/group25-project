import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import RefreshToken from "../models/refreshToken.model.js";

// ⚙️ Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Đăng ký
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.status(201).json({
      message: "Đăng ký thành công!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server khi đăng ký!" });
  }
};

// ✅ Đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng!" });

    // 🟢 Tạo Access Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // 🟢 Tạo Refresh Token và lưu vào DB có expiresAt
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_EXPIRES_IN || "7d" }
    );

    // 🧩 Giải mã refreshToken để lấy thời gian hết hạn
    const decoded = jwt.decode(refreshToken);

    // 🧠 Lưu Refresh Token vào MongoDB (fix lỗi expiresAt)
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(decoded.exp * 1000), // chuyển UNIX time sang Date
    });

    // ✅ Trả về phản hồi cho client
    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi đăng nhập chi tiết:", error.message, error.stack);
    res.status(500).json({ message: "Lỗi server khi đăng nhập!" });
  }
};


// ✅ Quên mật khẩu
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại!" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Đặt lại mật khẩu",
      html: `
        <h3>Xin chào ${user.name},</h3>
        <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
        <p>Nhấn vào link bên dưới để đặt lại mật khẩu (hết hạn sau 10 phút):</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Đã gửi email khôi phục mật khẩu!" });
  } catch (error) {
    console.error("❌ Lỗi forgotPassword:", error);
    res.status(500).json({ message: "Lỗi khi gửi email!" });
  }
};

// ✅ Đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Upload Avatar (Cloudinary)
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file)
      return res.status(400).json({ message: "Vui lòng chọn ảnh để tải lên!" });

    const avatarUrl = req.file.path || req.file.url;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    user.avatar = avatarUrl;
    await user.save();

    res.status(200).json({
      message: "Tải ảnh đại diện thành công!",
      avatar: avatarUrl,
    });
  } catch (error) {
    console.error("❌ Lỗi upload avatar:", error);
    res.status(500).json({ message: "Lỗi server khi upload avatar!" });
  }
};

// 🟢 Làm mới Access Token bằng Refresh Token
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "Thiếu refresh token!" });

  try {
    const existingToken = await RefreshToken.findOne({ token: refreshToken });
    if (!existingToken)
      return res.status(403).json({ message: "Refresh token không hợp lệ hoặc đã bị thu hồi!" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại!" });

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    res.json({
      message: "Làm mới Access Token thành công!",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("❌ Lỗi refresh token:", error);
    res.status(401).json({ message: "Refresh token hết hạn hoặc không hợp lệ!" });
  }
};

// 🟢 Đăng xuất - xóa Refresh Token khỏi DB
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Thiếu refresh token!" });

    const deleted = await RefreshToken.findOneAndDelete({ token: refreshToken });
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy token để xóa!" });

    res.status(200).json({ message: "Đăng xuất thành công, token đã bị thu hồi!" });
  } catch (error) {
    console.error("❌ Lỗi khi logout:", error);
    res.status(500).json({ message: "Lỗi server khi đăng xuất!" });
  }
};
