import Order from "../model/OrderModel.js";
import Shipment from "../model/ShipmentModel.js";
import { createShiprocketShipment } from "../utils/shiprocket.js";

export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    const shipData = await createShiprocketShipment(order);

    const shipment = new Shipment({
      orderId: order._id,
      shiprocketId: shipData.data.shipment_id,
      courier: shipData.data.courier_company,
      trackingNumber: shipData.data.awb_code,
      status: "Shipped",
      estimatedDelivery: shipData.data.delivery_date,
    });
    console.log(shipment)
    await shipment.save();

    res.status(201).json({ success: true, order, shipment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
