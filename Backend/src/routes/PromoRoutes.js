//routes/PromoRoutes.js

import express from 'express';
import { Applypromo,  PromoCreate, PromoDelete, PromoShow, PromoUpdate } from '../controller/PromoController.js';
import { UserapplyPromo } from '../middleware/authUser.js';
import { verifyAdmin } from '../middleware/auth.js';
const router=express.Router();


// Apply Promo-code "/apply" Route
router.post("/apply",UserapplyPromo, Applypromo);

// Create Promo-code Show Details
router.get("/show",verifyAdmin ,PromoShow)

// Create Promo-code Add Route
router.post("/create",verifyAdmin,PromoCreate);

// Create Promo-code Update Route
router.put("/:id",verifyAdmin,PromoUpdate);

//Create Promo-code Delete Route
router.delete("/:id",verifyAdmin,PromoDelete)

export default router