import express from "express";
import { createOrder } from "../controller/OrderController.js";
import { getShiprocketToken } from "../utils/shiprocket.js";

const router = express.Router();
router.post("/", createOrder);  

router.get("/",getShiprocketToken)
export default router;
