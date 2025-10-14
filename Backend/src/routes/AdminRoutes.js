// routes/AdminRoutes.js
import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import { AdminLogin, Check,  SignUpAdmin,  UpdateAdmin } from "../controller/AdminController.js";
import { verifyAdmin } from "../middleware/auth.js";

dotenv.config();
const router = express.Router();
//Admin Sign Up
router.post("/signup",SignUpAdmin);

// Admin login
router.post("/login", AdminLogin);

// Update admin by ID
router.put("/update/:id", verifyAdmin, UpdateAdmin);

// Verify admin token
router.get("/check", verifyAdmin, Check);


export default router;
