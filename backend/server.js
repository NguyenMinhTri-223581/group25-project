import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Định nghĩa route chính xác
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Kiểm tra hoạt động
app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});

// Lắng nghe cổng
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại cổng ${PORT}`);
});
