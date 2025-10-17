import express from 'express';
import { Createorder, GetPayment, VerifyPayment } from '../controller/paymentController.js';

const router=express.Router();

router.get("/pay",GetPayment)

router.post("/create-order",Createorder);

router.post("/verift-payment",VerifyPayment)

export default router