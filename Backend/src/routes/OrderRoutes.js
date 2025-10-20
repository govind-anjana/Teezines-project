import express from "express";
import { Createorder } from "../controller/paymentController.js";

const router = express.Router();
router.post("/", Createorder);
export default router;
