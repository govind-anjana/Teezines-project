// models/AdminModel.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate admin usernames
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const AdminModel = mongoose.model("Admin", adminSchema);

export default AdminModel;
