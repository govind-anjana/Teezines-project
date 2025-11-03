//routes/PromoRoutes.js

import express from 'express';
import { Applypromo,  PromoCreate, PromoDelete, PromoShow, PromoUpdate } from '../controller/PromoController.js';
import { UserapplyPromo } from '../middleware/authUser.js';
import { verifyAdmin } from '../middleware/auth.js';
const router=express.Router();


// Apply Promo-code "/apply" Route (User Only)
router.post("/apply",UserapplyPromo, Applypromo);

// Create Promo-code Show Details (Admin Only)
router.get("/show",verifyAdmin ,PromoShow)

// Create Promo-code Add Route (Admin Only)
router.post("/create",verifyAdmin,PromoCreate);

// Create Promo-code Update Route (Admin Only)
router.put("/:id",verifyAdmin,PromoUpdate);

//Create Promo-code Delete Route (Admin Only)
router.delete("/:id",verifyAdmin,PromoDelete)

export default router