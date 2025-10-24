// models/ProductModel.js
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
}, { timestamps: true });

const CategoryModel = mongoose.model("Category", CategorySchema);
export default CategoryModel;
