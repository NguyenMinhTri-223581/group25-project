import Log from "../models/logModel.js";

export const logActivity = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const action = `${req.method} ${req.originalUrl}`;
    const ip = req.ip;

    await Log.create({ userId, action, ip });
  } catch (error) {
    console.error("⚠️ Lỗi ghi log:", error.message);
  }
  next();
};
