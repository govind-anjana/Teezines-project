// ================================
// Import Dependencies
// ================================
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getAllAiUsage, UseAI } from "../controller/AiUseUserController.js";
import { CurrentStatus, Toggle } from "../controller/AiToggleController.js";
import { GetAiLimit, SetAiLimit } from "../controller/AiCreateDetelineController.js";
import { UserapplyPromo } from "../middleware/authUser.js";
import { AiUsageHandler, GetAllAiUsage } from "../controller/AiUsageController.js";
import { verifyAdmin } from "../middleware/auth.js";

dotenv.config();
const router = express.Router();

// ================================
// AI Toggle Routes
// ================================

// Get current AI logout visibility status
router.get("/status", CurrentStatus);

// Toggle AI logout visibility (Admin only)
router.post("/toggle-status", verifyAdmin, Toggle);

// ================================
// AI Limit Routes
// ================================

// Admin sets AI usage limit type and count
router.post("/set", verifyAdmin, SetAiLimit);

// Admin gets the current AI limit settings
router.get("/get", verifyAdmin, GetAiLimit);

// ================================
// AI Usage by User
// ================================

// User uses AI within allowed limits
router.post("/use-user", UserapplyPromo, UseAI);

// ================================
// Admin: AI Usage Reports
// ================================

// Admin gets all AI usage data (old endpoint)
router.get("/usageall", verifyAdmin, getAllAiUsage);

// Admin gets all AI usage data (new endpoint)
router.get("/use", verifyAdmin, GetAllAiUsage);

// ================================
// User AI Action Tracking
// ================================

// User action (generate, response, accepted)
router.post("/use", UserapplyPromo, AiUsageHandler);

export default router;
