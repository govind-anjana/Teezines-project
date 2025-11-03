import express from 'express';
import { Createorder, GetPayment, VerifyPayment } from '../controller/paymentController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router=express.Router();

router.get("/all",verifyAdmin,GetPayment);

router.post("/create-order",Createorder);

router.post("/verify-payment",VerifyPayment);   

export default router