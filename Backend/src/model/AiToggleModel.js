// models/Setting.js
import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  logoutVisible: { type: Boolean, default: true }
}, { timestamps: true });

const AiToggleModel=mongoose.model("AiToggle", settingSchema);
export default AiToggleModel
