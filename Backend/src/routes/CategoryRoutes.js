import express from 'express';
import { CategoryAdd, CategoryUpdate, Getcategory } from '../controller/CategoryController.js';

const router=express.Router();

router.get("/",Getcategory);

router.post("/",CategoryAdd);

router.put("/:id",CategoryUpdate)


export default router