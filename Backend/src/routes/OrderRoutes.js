import express from "express";
import { cancelOrder, createOrder, GetAllOrders, GetSingleOrder, updateOrder1 } from "../controller/OrderController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Add to Orders
router.post("/", createOrder);  

// Get all Orders (Admin Only)
router.get("/",verifyAdmin,GetAllOrders);

// Get single Orders by Id 
router.get("/:id",GetSingleOrder);

// Update on Orders by id (Admin Only)
router.put("/update/:id",verifyAdmin,updateOrder1);

// Cancel an Order by id (Admin Only)
router.put("/cancel/:id",verifyAdmin,cancelOrder);
export default router;
