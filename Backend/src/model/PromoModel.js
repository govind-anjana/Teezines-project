import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountValue: { type: Number, required: true },
  startDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  usedBy: [{ type: String }], // list of user emails who used it
  isActive: { type: Boolean, default: true },

  applicableCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  applicableProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    default: null,
  },
});

const PromoCodeModel = mongoose.model("PromoCode", promoCodeSchema);
export default PromoCodeModel;
