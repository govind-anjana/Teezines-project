import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ["flat", "percentage"] },
  discountValue: { type: Number, required: true },
  minAmount: { type: Number },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  usedBy: [{ type: String }], // list of user emails who used it
  isActive: { type: Boolean, default: true },
});

const PromoCodeModel = mongoose.model("PromoCode", promoCodeSchema);
export default PromoCodeModel;
