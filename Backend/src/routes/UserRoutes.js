import express from 'express';
import { UpdateUser, UserLogin } from '../controller/authController.js';
import { SignUp, VerifyOtp } from '../controller/auth.js';
import { GetProducts } from '../controller/ProductController.js';
const router=express.Router();
router.post("/signup",SignUp);
router.post("/verify-otp",VerifyOtp)
router.post("/login",UserLogin);
router.put("/UpdatePassword",UpdateUser);

router.get("/product",GetProducts)

export default router