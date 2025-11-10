import axios from "axios";
import mongoose from "mongoose";
import OrderModel from "../model/OrderModel.js";
import ShipmentModel from "../model/ShipmentModel.js";
import { createShiprocketShipment } from "../utils/shiprocket.js";
import { getShiprocketToken } from "../utils/shiprocket.js";

export const createOrder = async (req, res) => {
  try {
const {
      customerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      items,
      totalAmount,
      paymentMethod,
    } = req.body;
   

    //  Block Cash on Delivery
    if (paymentMethod === "COD" || paymentMethod === "Cash on Delivery") {
      return res.status(400).json({
        success: false,
        message: "Cash on Delivery is not allowed. Please pay online.",
      });
    }

      const totalWeight = items.reduce(
      (sum, item) => sum + (item.weight || 0) * (item.quantity || 1),
      0
    );

    //   Create local order
    const order = new OrderModel({  customerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      items,
      totalAmount,
      paymentMethod,
      totalWeight});
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

export const GetAllOrders = async (req, res) => {
  try {
    // Find all orders and populate related shipment
    const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();

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
};
export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    //  Find the order
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    //  Find shipment (if any)
    const shipment = await ShipmentModel.findOne({ orderId: id });

    //  Determine final order status
    let finalStatus = "Pending";

    if (order.status === "Cancelled") {
      finalStatus = "Cancelled";
    } else if (shipment?.status === "Delivered" || order.status === "Completed") {
      finalStatus = "Delivered";
    } else if (shipment?.status) {
      finalStatus = shipment.status;
    }

    //  Format order date
    const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    //  Delivery date logic
    let deliveryDate = null;

    if (finalStatus !== "Cancelled") {
      if (shipment?.estimatedDelivery) {
        deliveryDate = new Date(shipment.estimatedDelivery).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      } else {
        // Default: estimated +4 days
        const est = new Date(order.createdAt);
        est.setDate(est.getDate() + 4);
        deliveryDate = est.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    }

    //  Final response with full details
    res.status(200).json({
      success: true,
      message: "Order details with shipment & delivery info",
      order: {
        id: order._id,
        customerName: order.customerName,
        email: order.email,
        phone: order.phone,
        address: order.address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        items: order.items,
        status: finalStatus,
        orderDate,
        deliveryDate,
        shipment: shipment
          ? {
              courier: shipment.courier,
              trackingNumber: shipment.trackingNumber,
              status: shipment.status,
              estimatedDelivery: shipment.estimatedDelivery,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderData, shipmentData } = req.body;

    //  Check order exists
    const order = await OrderModel.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    //  Find linked shipment
    const shipment = await ShipmentModel.findOne({
      orderId: new mongoose.Types.ObjectId(id),
    });
    if (!shipment) {
      return res
        .status(400)
        .json({ success: false, message: "Shipment not created yet" });
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
      updatedOrder = await OrderModel.findByIdAndUpdate(id, orderData, {
        new: true,
      });
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
        console.warn(
          "Shiprocket update failed:",
          err.response?.data || err.message
        );
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
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    //  Find shipment linked with this order
    const shipment = await ShipmentModel.findOne({
      orderId: new mongoose.Types.ObjectId(id),
    });
    //  If already cancelled
    if (order.status === "Cancelled" || shipment.status === "Cancelled") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Order and shipment are already cancelled.",
        });
    }

    //  If Shiprocket status is not cancellable
    if (shipment.status === "Delivered" || shipment.status === "In Transit") {
      return res.status(400).json({
        success: false,
        message:
          "This order cannot be cancelled because it has already been shipped or delivered.",
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
        console.error(
          "⚠️ Shiprocket cancel failed:",
          err.response?.data || err.message
        );
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
      message:
        "Order and shipment have been successfully cancelled on both the website and Shiprocket.",
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
