import express from "express";
import { createOrder, DeleteOrder, GetAllOrders, GetSingleOrder, UpdateOrder } from "../controller/OrderController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Add to Orders
router.post("/", createOrder);  

// Get all Orders (Admin Only)
router.get("/",verifyAdmin,GetAllOrders);

// Get single Orders by Id 
router.get("/:id",GetSingleOrder);

// Update a Orders by id (Admin Only)
router.put("/:id",verifyAdmin,UpdateOrder);

// Delete a Orders by id (Admin Only)
router.delete("/:id",verifyAdmin,DeleteOrder);
export default router;
