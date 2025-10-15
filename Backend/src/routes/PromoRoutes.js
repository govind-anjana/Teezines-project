//routes/PromoRoutes.js

import express from 'express';
import { Applypromo, CreatePromo, PromoUpdate } from '../controller/PromoController.js';
import { applyPromo } from '../middleware/authUser.js';
import { verifyAdmin } from '../middleware/auth.js';
const router=express.Router();


// Apply Promo-code "/apply" Route
router.post("/apply",applyPromo, Applypromo);

// Create Promo-code "/create" Route
router.post("/create",CreatePromo);

// Create Promo-code Update Route
router.put("/:id",verifyAdmin,PromoUpdate);

//Create Promo-code Delete Route
// router.delete("/:id",PromoDelete)

export default router