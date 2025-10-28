// models/BannerModel.js
import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
   productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // linked product ID
    },
    isActive: {
      type: Boolean,
      default: true, // frontend me show karne ke liye toggle
    },
    img: {
      type: String,
      required: true, // Cloudinary image URL is required
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const BannerModel = mongoose.model("Banner", BannerSchema);

export default BannerModel;
