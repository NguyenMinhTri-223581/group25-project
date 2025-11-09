import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 5, // giới hạn 5 lần
  message: { message: "Thử đăng nhập quá nhiều lần. Vui lòng thử lại sau 1 phút!" },
  standardHeaders: true,
  legacyHeaders: false,
});
