import express from 'express';
import { CategoryAdd, Getcategory } from '../controller/CategoryController.js';

const router=express.Router();

router.get("/",Getcategory);

router.post("/",CategoryAdd)


export default router