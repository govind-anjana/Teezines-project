// models/BannerModel.js
import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // Removes extra spaces
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
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
