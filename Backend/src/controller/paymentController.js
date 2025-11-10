 import Razorpay from "razorpay";
import { createHmac } from "crypto";
import PaymentModel from "../model/PaymentModel.js";
import dotnev from 'dotenv';
dotnev.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

 export const GetPayment=async(req,res)=>{
    const payments = await PaymentModel.find().sort({ date: -1 });
  res.json(payments);
 }
 export const Createorder=async(req,res)=>{
    try {
    const { amount } = req.body;
     if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }
    const options = {
      amount:amount*100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      message: "Order created successfully",
       order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
 }

 export const VerifyPayment=async(req,res)=>{
     try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = 
      createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    const status =
      expectedSign === razorpay_signature ? "Success" : "Failed";

    // Save payment to MongoDB
    await PaymentModel.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency,
      status,
    });

    if (status === "Success") {
      res.json({ success: true, message: "Payment verified & saved " });
    } else {
      res.json({ success: false, message: "Signature invalid " });
    }
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
 }