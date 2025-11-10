import express from "express";
import { cancelOrder, createOrder, GetAllOrders,  getOrderDetails,    updateOrder } from "../controller/OrderController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Add to Orders
router.post("/", createOrder);  

// Get all Orders (Admin Only)
router.get("/",verifyAdmin,GetAllOrders);

// Get single Orders by Id 
router.get("/:id",getOrderDetails);

// router.get("/deliverydate/:id",getOrderWithDelivery);

// Update on Orders by id (Admin Only)
router.put("/update/:id",verifyAdmin,updateOrder);

// Cancel an Order by id (Admin Only)
router.put("/cancel/:id",verifyAdmin,cancelOrder);
export default router;
