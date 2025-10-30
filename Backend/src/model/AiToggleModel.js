// models/Setting.js
import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  logoutVisible: { type: Boolean, default: false }
}, { timestamps: true });

const AiToggleModel=mongoose.model("AiToggle", settingSchema);
export default AiToggleModel
