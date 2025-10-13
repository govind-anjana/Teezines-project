// models/User.js
import mongoose from "mongoose";

const graphSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
   
}, { timestamps: true });

export default mongoose.model("graphql", graphSchema);
