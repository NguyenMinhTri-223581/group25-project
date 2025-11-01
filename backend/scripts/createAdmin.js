import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js"; // đường dẫn đúng tới User model của bạn

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "admin@example.com";
    const password = "admin123"; // bạn có thể đổi
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists!");
    } else {
      const adminUser = new User({
        name: "Administrator",
        email,
        password: hashedPassword,
        role: "admin"
      });
      await adminUser.save();
      console.log("✅ Admin created successfully!");
    }

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
};

createAdmin();
