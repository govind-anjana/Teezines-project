 import mongoose from "mongoose";

const aiLimitSettingSchema = new mongoose.Schema({
  limitType: {
    type: String,
    enum: ["perday", "overall"],
    required: true,
    default: "perday", // default option
  },
  limitCount: {
    type: Number,
    required: true,
    default: 3, // default times
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("AiLimit", aiLimitSettingSchema);
