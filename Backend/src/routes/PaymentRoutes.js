import express from 'express';
import { Createorder, GetPayment, VerifyPayment } from '../controller/paymentController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router=express.Router();

// Get a all payment (Admin Only) 
router.get("/all",verifyAdmin,GetPayment);

// Add a payment order 
router.post("/create-order",Createorder);

//Add a verify payment 
router.post("/verify-payment",VerifyPayment);   

export default router