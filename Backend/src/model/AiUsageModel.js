import mongoose from "mongoose";

const aiUsageSchema = new mongoose.Schema({
  user: {
    type: String, // abhi username rakh rahe hain
    required: true
  },
  generateUsed: { type: Number, default: 0 },
  responseUsed: { type: Number, default: 0 },
  acceptedUsed: { type: Number, default: 0 },
  lastUsed: { type: Date, default: Date.now }
}, { timestamps: true });

const AiUsage = mongoose.model("AiUsage", aiUsageSchema);
export default AiUsage;
