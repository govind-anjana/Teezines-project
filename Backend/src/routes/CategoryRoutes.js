import express from 'express';
import { CategoryAdd, CategoryDelete, CategoryUpdate, Getcategory } from '../controller/CategoryController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router=express.Router();

// get a category (Admin Only)
router.get("/",verifyAdmin,Getcategory);

// Add a category (Admin Only)
router.post("/",verifyAdmin,CategoryAdd);

//Update to category by ID (Admin Only)
router.put("/:id",verifyAdmin,CategoryUpdate);

// Delete to category by ID (Admin Only)
router.delete("/:id",verifyAdmin,CategoryDelete)


export default router