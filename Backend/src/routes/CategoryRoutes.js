import express from 'express';
import { CategoryAdd, CategoryDelete, CategoryUpdate, Getcategory } from '../controller/CategoryController.js';

const router=express.Router();

router.get("/",Getcategory);

router.post("/",CategoryAdd);

router.put("/:id",CategoryUpdate);

router.delete("/:id",CategoryDelete)


export default router