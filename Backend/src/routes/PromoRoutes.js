import express from 'express';
import { Applypromo, CreatePromo } from '../controller/PromoController.js';
import { applyPromo } from '../middleware/authUser.js';
const router=express.Router();

router.post("/create",CreatePromo);

router.post("/apply",applyPromo, Applypromo)

export default router