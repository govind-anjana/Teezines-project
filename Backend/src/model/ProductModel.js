// models/ProductModel.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  quantity: { type: Number, default: 1, min: 0 },
  img: [{ type: String }],
  sizes: [
    {
      size: { type: String, required: true },
      stock: { type: Number, default: 0 }
    }
  ],
  rating: { type: Number, default: 4, min: 0, max: 5 },
  productDetails:{type:String},
  productDescription: { type: String },
}, { timestamps: true });

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;
