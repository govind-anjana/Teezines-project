import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

let shiprocketToken = null;

//  Generate or reuse token
export const getShiprocketToken = async () => {
  if (shiprocketToken) return shiprocketToken;

  const response = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });

  shiprocketToken = response.data.token;
  return shiprocketToken;
};

//  Create Shipment on Shiprocket
export const createShiprocketShipment = async (order) => {
  const token = await getShiprocketToken();
  const totalWeight =
      order.totalWeight ||
      order.items.reduce(
        (sum, item) => sum + (item.weight || 0) * (item.quantity || 1),
        0
      );

  const payload = {
    order_id: `ORD-${order._id}`,
    pickup_location: "Home", // Shiprocket panel me hona chahiye
    billing_customer_name: order.customerName,
    billing_address: order.address,
    billing_city: order.city,
    billing_pincode: order.pincode,
    billing_state: order.state,
    billing_country: "India",
    order_date: new Date().toISOString(),
    billing_phone: order.phone,
    billing_email: order.email,
    billing_last_name: "",
    shipping_is_billing: true,
    order_items: order.items.map((item) => ({
      name: item.name,
      sku: item.sku,
      units: item.quantity,
      size:item.size,
      selling_price: item.price,
      weight: item.weight || 0.5,
    })),
    payment_method: order.paymentMethod,
    sub_total: order.totalAmount,
    length: 10,
    breadth: 10,
    height: 5,
    weight:  totalWeight,
  };
  // console.log(" Shiprocket payload weight (kg):", totalWeight);
console.log(" Shiprocket Payload Sent:", payload);
  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
};
