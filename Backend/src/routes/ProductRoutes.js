import express from 'express';
import { BuyNow, GetProducts, ProductAdd, ProductById, ProductDelete, ProductUpdate } from '../controller/ProductController.js';
import { verifyAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
const router=express.Router();

// Get all products
router.get("/",GetProducts);

//Get Product Id by Find
router.get("/:id",ProductById);

// Add a product (Admin only)
router.post("/",verifyAdmin, upload.array("img", 5), ProductAdd);

// Update a product by ID (Admin only)
router.put("/:id",  verifyAdmin, upload.array("img", 5), ProductUpdate);

// Delete a product by ID (Admin only)
router.delete("/:id",verifyAdmin, ProductDelete);

// User to product size to Decrement 
router.post("/buy-now",BuyNow);

export default router;