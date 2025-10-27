import mongoose from "mongoose";

const aiUsageCountSchema = new mongoose.Schema({
  totalUsers: { type: Number, default: 0 },
});

const AiModel=mongoose.model("AIUsageCount", aiUsageCountSchema);
export default AiModel
