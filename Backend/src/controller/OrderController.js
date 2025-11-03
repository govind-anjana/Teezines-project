import OrderModel from "../model/OrderModel.js";
import ShipmentModel from "../model/ShipmentModel.js";
import { createShiprocketShipment } from "../utils/shiprocket.js";


export const createOrder = async (req, res) => {
  try {
    //   Create local order
    const order = new OrderModel(req.body);
    await order.save();

    //   Create shipment on Shiprocket
    const shipData = await createShiprocketShipment(order);

    //   Save shipment details in DB
    const shipment = new ShipmentModel({
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


export const GetAllOrders=async(req,res)=>{
   try {
    // Find all orders and populate related shipment
    const orders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .lean();

    // For each order, find its shipment details
    const ordersWithShipment = await Promise.all(
      orders.map(async (order) => {
        const shipment = await ShipmentModel.findOne({ orderId: order._id });
        return {
          ...order,
          shipment: shipment || null, // add shipment details if available
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Orders with shipment details fetched successfully",
      orders: ordersWithShipment,
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
}

export const GetSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Find order by ID
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Find shipment related to that order
    const shipment = await ShipmentModel.findOne({ orderId: id });

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      order,
      shipment: shipment || null,
    });
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};
export const UpdateOrder = async (req, res) => {
  try {
    const { id } = req.params; // order ID
    const { orderData, shipmentData } = req.body; // fields to update

    //  Update order details
    const order = await OrderModel.findByIdAndUpdate(id, orderData, { new: true });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    //  Update shipment if related data provided
    let shipment = null;
    if (shipmentData) {
      shipment = await ShipmentModel.findOneAndUpdate(
        { orderId: id },
        shipmentData,
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
      shipment,
    });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};

export const DeleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Find order first
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Delete related shipment
    await ShipmentModel.deleteOne({ orderId: id });

    // Delete the order itself
    await OrderModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Order and related shipment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
};