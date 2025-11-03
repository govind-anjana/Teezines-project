import express from 'express';
import { BannerAdd, BannerAll, BannerDelete, BannerUpdate } from '../controller/BannerController.js';
import { verifyAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router=express.Router();
// Get all banners
router.get("/", BannerAll);

// Add a banner
router.post("/", upload.single("img"), BannerAdd);

// Update a banner by ID (Admin only)
router.put("/:id", verifyAdmin, upload.single("img"), BannerUpdate);

// Delete a banner by ID (Admin only)
router.delete("/:id", verifyAdmin, BannerDelete);

export default router;