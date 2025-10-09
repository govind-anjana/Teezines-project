import mongoose from "mongoose";

const BannerSchema=new mongoose.Schema({
    name:{type:String},
    email:{type:String},
    img:{type:String, required:true},

},{
    timestamps:true
});

export default new mongoose.model("Banners",BannerSchema);