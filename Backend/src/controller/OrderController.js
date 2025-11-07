import axios from "axios";
import mongoose from "mongoose";
import OrderModel from "../model/OrderModel.js";
import ShipmentModel from "../model/ShipmentModel.js";
import { createShiprocketShipment } from "../utils/shiprocket.js";
import { getShiprocketToken } from "../utils/shiprocket.js";

export const createOrder = async (req, res) => {
  try {
    //   Create local order
    const order = new OrderModel(req.body);
    await order.save();

    //   Create shipment on Shiprocket
    const shipData = await createShiprocketShipment(order);
      // console.log("Shiprocket Response:", shipData);
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
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderData, shipmentData } = req.body;

    //  Check order exists
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    //  Find linked shipment
   const shipment = await ShipmentModel.findOne({ orderId: new mongoose.Types.ObjectId(id) });
    if (!shipment) {
      return res.status(400).json({ success: false, message: "Shipment not created yet" });
    }

    //  Restrict update when shipment is NEW / CREATED / PENDING
    const restrictedStatuses = ["PENDING", "NEW", "CREATED"];
    if (restrictedStatuses.includes(shipment.status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be updated. Shipment status is "${shipment.status}".`,
      });
    }

    // Update order if data provided
    let updatedOrder = order;
    if (orderData && Object.keys(orderData).length > 0) {
      updatedOrder = await OrderModel.findByIdAndUpdate(id, orderData, { new: true });
    }

    //  Update shipment if data provided
    let updatedShipment = shipment;
    if (shipmentData && Object.keys(shipmentData).length > 0) {
      updatedShipment = await ShipmentModel.findOneAndUpdate(
        { orderId: mongoose.Types.ObjectId(id) },
        shipmentData,
        { new: true }
      );
    }

    //  Update Shiprocket order if linked
    let shiprocketResponse = null;
    if (order.shiprocket_order_id) {
      try {
        const token = await getShiprocketToken();

        const payload = {
          order_id: order.shiprocket_order_id,
          pickup_location: "Home",
          billing_customer_name: updatedOrder.customerName,
          billing_address: updatedOrder.address,
          billing_city: updatedOrder.city,
          billing_state: updatedOrder.state,
          billing_pincode: updatedOrder.pincode,
          billing_email: updatedOrder.email,
          billing_phone: updatedOrder.phone,
          shipping_is_billing: true,
          order_items: updatedOrder.items.map((item) => ({
            name: item.name,
            sku: item.sku,
            units: item.quantity,
            size: item.size,
            selling_price: item.price,
            weight: item.weight || 0.5,
          })),
          payment_method: updatedOrder.paymentMethod,
          sub_total: updatedOrder.totalAmount,
        };

        const response = await axios.put(
          `https://apiv2.shiprocket.in/v1/external/orders/update/${order.shiprocket_order_id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        shiprocketResponse = response.data;
      } catch (err) {
        console.warn("Shiprocket update failed:", err.response?.data || err.message);
      }
    }

    //  Send success response
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
      shipment: updatedShipment,
      shiprocketResponse,
    });
  } catch (err) {
    console.error("Update Order Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if order exists
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    //  Find shipment linked with this order
    const shipment = await ShipmentModel.findOne({
      orderId: new mongoose.Types.ObjectId(id),
    });
     //  If already cancelled
    if (order.status === "Cancelled" || shipment.status === "Cancelled") {
      return res.status(400).json({ success: false, message: "Order and shipment are already cancelled." });
    }

    //  If Shiprocket status is not cancellable
    if (shipment.status === "Delivered" || shipment.status === "In Transit") {
      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled because it has already been shipped or delivered.",
      });
    }
    // Cancel shipment on Shiprocket (if shiprocketId exists)
    if (shipment && shipment.shiprocketId) {
      try {
        const token = await getShiprocketToken();

        const response = await axios.post(
          "https://apiv2.shiprocket.in/v1/external/orders/cancel",
          { ids: [shipment.shiprocketId] },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // console.log(" Shiprocket cancel response:", response.data);

        //  Update shipment in DB
        shipment.status = "Cancelled";
        await shipment.save();
      } catch (err) {
        console.error("⚠️ Shiprocket cancel failed:", err.response?.data || err.message);
        return res.status(400).json({
          success: false,
          message: "Failed to cancel order on Shiprocket",
          error: err.response?.data || err.message,
        });
      }
    }

    //  Update local order in MongoDB
    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order and shipment have been successfully cancelled on both the website and Shiprocket.",
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while cancelling order",
      error: error.message,
    });
  }
};