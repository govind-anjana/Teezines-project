// models/ProductModel.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    premium: { type: Number, default: 0},
    quantity: { type: Number, default: 1, min: 0 },
    img: [{ type: String }],
    sizes: [
      {
        size: { type: String, required: true },
        stock: { type: Number, default: 0 },
      },
    ],
    productDetails: { type: String },
    productDescription: { type: String },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", ProductSchema);
export default ProductModel;
