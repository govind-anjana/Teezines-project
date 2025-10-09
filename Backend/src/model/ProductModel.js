import mongoose from "mongoose";
const ProductSchma=new mongoose.Schema({
    brand: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    dis: { type: String, default: "0%" },
    rating: { type: Number, default: 4 },
    img: { type: String, required: true },
       
},{timestamps:true})

const ProductModel=new mongoose.model("Product",ProductSchma);

export default ProductModel