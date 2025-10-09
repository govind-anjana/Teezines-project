import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const ConnectionData=()=>{
    mongoose.connect(process.env.MONGO_ATLAS).then((res)=>console.log("Connected Successfully")).catch((err)=>console.error("err",err))
}
export default ConnectionData