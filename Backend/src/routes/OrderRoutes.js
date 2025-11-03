import express from "express";
import { createOrder, DeleteOrder, GetAllOrders, GetSingleOrder, UpdateOrder } from "../controller/OrderController.js";
import { getShiprocketToken } from "../utils/shiprocket.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();
router.post("/", createOrder);  

router.get("/",verifyAdmin,GetAllOrders);

router.get("/:id",GetSingleOrder);

router.put("/:id",verifyAdmin,UpdateOrder);

router.delete("/:id",verifyAdmin,DeleteOrder);
export default router;
