import express from 'express';
import { GetSection, SectionAdd, SectionDelete, SectionUpdate } from '../controller/SectionController.js';
import { verifyAdmin } from '../middleware/auth.js';
import { AddSectionPro, GetProductsBySection, GetSectionProduct, RemoveProductFromSection, SectionProductReplace } from '../controller/SectionProController.js';

const router=express.Router();

// get all section
router.get("/",GetSection);

// Add a section (Admin Only)
router.post("/",verifyAdmin,SectionAdd);

// Update a Setion (Admin Only)
router.put("/:id",verifyAdmin,SectionUpdate);

// Delete a Section (Admin Only)
router.delete("/:id",verifyAdmin,SectionDelete);

// Get a section product
router.get("/product",GetSectionProduct)

// Get a section product by Find 
router.get("/:section", GetProductsBySection);

// Add a section product (Admin Only)
router.post("/product",verifyAdmin,AddSectionPro);

// Replace product to section product (Admin Only)
router.post("/replace-product",verifyAdmin,SectionProductReplace);

// Product remove to section product (Admin Only)
router.post("/product-remove",verifyAdmin, RemoveProductFromSection);


export default router;