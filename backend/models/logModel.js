import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true },
  ip: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Log", logSchema);
