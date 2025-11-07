import axios from "axios";
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
      console.log("Shiprocket Response:", shipData);
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
        let shiprocketResponse = null;
    if (order.shiprocket_order_id) {
      const token = process.env.SHIPROCKET_TOKEN;

      try {
        const response = await axios.put(
          `https://apiv2.shiprocket.in/v1/external/orders/update/${order.shiprocket_order_id}`,
          {
            ...orderData, // send updated fields
            order_id: order.shiprocket_order_id,
            pickup_location: order.pickup_location || "Home",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        shiprocketResponse = response.data;
      } catch (err) {
        console.warn(" Shiprocket Update Failed:", err.response?.data || err.message);
      }
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

export const updateOrder1 = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderData, shipmentData } = req.body;

    // 1️⃣ Fetch the order
    const order = await OrderModel.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // 2️⃣ Fetch the shipment (convert id to ObjectId)
    const shipment = await ShipmentModel.findOne({ orderId: mongoose.Types.ObjectId(id) });
    if (!shipment) return res.status(400).json({ success: false, message: "Shipment not created yet" });

    // 3️⃣ Restrict update if shipment is not Pending/Created
    if (shipment.status !== "Pending" && shipment.status !== "Created") {
      return res.status(400).json({
        success: false,
        message: `Cannot update order. Shipment status is "${shipment.status}"`,
      });
    }

    // 4️⃣ Update local order
    const updatedOrder = await OrderModel.findByIdAndUpdate(id, orderData, { new: true });

    // 5️⃣ Update shipment if data provided
    let updatedShipment = shipment;
    if (shipmentData) {
      updatedShipment = await ShipmentModel.findOneAndUpdate(
        { orderId: mongoose.Types.ObjectId(id) },
        shipmentData,
        { new: true }
      );
    }

    // 6️⃣ Update Shiprocket order if exists
    let shiprocketResponse = null;
    if (order.shiprocket_order_id) {
      try {
        const token = await getShiprocketToken();
        const payload = {
          order_id: order.shiprocket_order_id,
          pickup_location: "Home", // fixed pickup location
          billing_customer_name: updatedOrder.customerName,
          billing_address: updatedOrder.address,
          billing_city: updatedOrder.city,
          billing_state: updatedOrder.state,
          billing_pincode: updatedOrder.pincode,
          billing_email: updatedOrder.email,
          billing_phone: updatedOrder.phone,
          shipping_is_billing: true,
          order_items: updatedOrder.items.map(item => ({
            name: item.name,
            sku: item.sku,
            units: item.quantity,
            size: item.size,
            selling_price: item.price,
            weight: item.weight || 0.5
          })),
          payment_method: updatedOrder.paymentMethod,
          sub_total: updatedOrder.totalAmount
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

    // 7️⃣ Send response
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
      shipment: updatedShipment,
      shiprocketResponse
    });
  } catch (err) {
    console.error("Update Order Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};