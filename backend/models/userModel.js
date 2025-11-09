import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetPasswordToken: {
  type: String,
   },
resetPasswordExpire: {
  type: Date,
},

  },
  { timestamps: true }
);

// ✅ Cách định nghĩa model an toàn, không bị lỗi OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
