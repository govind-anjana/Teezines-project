import express from 'express';
import { GetProducts, ProductAdd, ProductById, ProductDelete, ProductUpdate } from '../controller/ProductController.js';
import { verifyAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
const router=express.Router();

// Get all products
router.get("/",GetProducts);

//Get Product Id by Find
router.get("/:id",ProductById);

// Add a product (Admin only)
router.post("/", upload.array("img", 5), ProductAdd);

// Update a product by ID (Admin only)
router.put("/:id", verifyAdmin, ProductUpdate);

// Delete a product by ID (Admin only)
router.delete("/:id",verifyAdmin, ProductDelete);

export default router;