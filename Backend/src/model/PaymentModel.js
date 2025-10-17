import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,
  amount: Number,
  currency: String,
  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now },
},{
    timestamps:true
});

const PaymentModel=mongoose.model("Payment", PaymentSchema);
export default PaymentModel
