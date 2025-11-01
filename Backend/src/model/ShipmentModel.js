import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  shiprocketId: String,
  courier: String,
  trackingNumber: String,
  status: { type: String, default: "Created" },
  estimatedDelivery: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Shipment", ShipmentSchema);
