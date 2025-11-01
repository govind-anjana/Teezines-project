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
  console.log(" Shiprocket Token Generated");
  return shiprocketToken;
};

//  Create Shipment on Shiprocket
export const createShiprocketShipment = async (order) => {
  const token = await getShiprocketToken();

  const payload = {
    order_id: `ORD-${order._id}`,
    order_date: new Date().toISOString(),
    pickup_location: "Primary", // Shiprocket panel me hona chahiye
    billing_customer_name: order.customerName,
    billing_last_name: "",
    billing_address: order.address,
    billing_city: order.city,
    billing_pincode: order.pincode,
    billing_state: order.state,
    billing_country: "India",
    billing_email: order.email,
    billing_phone: order.phone,
    shipping_is_billing: true,
    order_items: order.items.map((item) => ({
      name: item.name,
      sku: item.sku,
      units: item.quantity,
      selling_price: item.price,
      weight: item.weight || 0.5,
    })),
    payment_method: order.paymentMethod,
    sub_total: order.totalAmount,
    length: 10,
    breadth: 10,
    height: 10,
    weight: 1,
  };

  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
};
