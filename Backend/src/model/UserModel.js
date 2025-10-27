// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
   phone:    { type: String, default: "" },
  address:  { type: String, default: "" },
  isVerified: { type: Boolean, default: false },
  otpHash: { type: String },            
  otpExpiresAt: { type: Date },         
 hasUsedAI: { type: Boolean, default: false },
  verificationToken: { type: String },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
