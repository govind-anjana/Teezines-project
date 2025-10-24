import axios from "axios";
import dotenv from 'dotenv';
dotenv.config()
let tokenCache = null;

export const getShiprocketToken = async () => {
  if (tokenCache) return tokenCache;

  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,      // <-- Your Shiprocket email
      password: process.env.SHIPROCKET_PASSWORD // <-- Your Shiprocket password
    }
  );

  tokenCache = response.data.token;
  return tokenCache;
};

export const createShiprocketShipment = async (order) => {
  const token = await getShiprocketToken();

  const shipmentData = {
    order_id: order._id.toString(),
    order_date: new Date(),
    pickup_location: "Mumbai Warehouse",   // <-- Must match Shiprocket dashboard
    billing_customer_name: order.customerName,
    billing_address: order.address,
    billing_city: order.city,
    billing_state: order.state,
    billing_pincode: order.pincode,
    billing_country: "India",
    billing_email: order.email,
    billing_phone: order.phone,
    shipping_is_billing: true,
    weight: order.items.reduce((sum, i) => sum + i.weight * i.quantity, 0),
    payment_method: order.paymentMethod,
    sub_total: order.totalAmount,
    shipping_charges: 50,
    discount: 0,
    length: 10,
    breadth: 10,
    height: 10,
    comment: "Handle with care",
    products: order.items.map((i) => ({
      name: i.name,
      sku: i.sku,
      units: i.quantity,
      selling_price: i.price,
    })),
  };

  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      shipmentData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (err) {
    console.log("Shiprocket Error:", err.response.data);
    throw err;
  }
};
