// routes/UserRoutes.js
import express from 'express';

// Import controller functions
import { UpdatePassword, UpdateProfile, UserLogin } from '../controller/authController.js';
import { register,  VerifyOtp } from '../controller/auth.js';
import { GetProducts } from '../controller/ProductController.js';
import { BannerAll } from '../controller/BannerController.js';

// Create a router instance
const router = express.Router();

// User Register route
router.post("/register", register);

// Verify OTP route after signup
router.post("/verify-otp", VerifyOtp);

// User login route
router.post("/login", UserLogin);

// Update user password route
router.put("/updatepass", UpdatePassword);

// Update user profile route
router.put("/updateprofile", UpdateProfile);

 

export default router;
