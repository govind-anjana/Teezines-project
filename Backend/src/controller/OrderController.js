import Order from "../model/OrderModel.js";
import Shipment from "../model/ShipmentModel.js";
import { createShiprocketShipment } from "../utils/shiprocket.js";

export const createOrder = async (req, res) => {
  try {
    //  Step 1: Create local order
    const order = new Order(req.body);
    await order.save();

    //  Step 2: Create shipment on Shiprocket
    const shipData = await createShiprocketShipment(order);

    //  Step 3: Save shipment details in DB
    const shipment = new Shipment({
      orderId: order._id,
      shiprocketId: shipData.order_id,
      courier: shipData?.courier_company || "Pending",
      trackingNumber: shipData?.awb_code || "",
      status: shipData.status || "Created",
      estimatedDelivery: shipData?.delivery_date || "",
    });

    await shipment.save();

    res.status(201).json({
      success: true,
      message: "Order and Shipment created successfully!",
      order,
      shipment,
    });
  } catch (err) {
    console.error(" Shiprocket Error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
