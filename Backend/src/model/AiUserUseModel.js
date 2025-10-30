import mongoose from "mongoose";

const userAiUsageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  usedCount: { type: Number, default: 0 },
  lastUsedDate: { type: Date }
}, { timestamps: true });



const AiModel=mongoose.model("AIUsageCount", userAiUsageSchema);
export default AiModel
