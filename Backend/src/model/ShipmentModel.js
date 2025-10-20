import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  shiprocketId: String,
  courier: String,
  trackingNumber: String,
  status: {
    type: String,
    enum: ["Pending","Shipped","In Transit","Out for Delivery","Delivered","Returned"],
    default: "Pending"
  },
  estimatedDelivery: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Shipment", ShipmentSchema);
