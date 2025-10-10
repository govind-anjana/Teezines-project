// models/ProductModel.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Ensures price cannot be negative
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    dis: {
      type: String,
      default: "0%", // Discount percentage as string
    },
    rating: {
      type: Number,
      default: 4,
      min: 0,
      max: 5,
    },
    img: {
      type: String,
      required: true, // Image URL
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;
