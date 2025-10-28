require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// 🧩 Kết nối MongoDB
connectDB();

// 🧱 Middleware
app.use(express.json());
app.use(cors());

// 🛠️ Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// 🧪 Route test để kiểm tra server
app.get("/", (req, res) => {
  res.send("✅ Server đang chạy thành công!");
});

// 🚀 Cổng chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại cổng ${PORT}`));
