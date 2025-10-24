import express from 'express';
import { CategoryAdd, CategoryDelete, CategoryUpdate, Getcategory } from '../controller/CategoryController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router=express.Router();

router.get("/",verifyAdmin,Getcategory);

router.post("/",verifyAdmin,CategoryAdd);

router.put("/:id",verifyAdmin,CategoryUpdate);

router.delete("/:id",verifyAdmin,CategoryDelete)


export default router