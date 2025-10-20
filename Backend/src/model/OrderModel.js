import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  items: [
    { name: String, sku: String, quantity: Number, price: Number, weight: Number }
  ],
  totalAmount: Number,
  paymentMethod: { type: String, enum: ["COD", "Prepaid"] },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", OrderSchema);
