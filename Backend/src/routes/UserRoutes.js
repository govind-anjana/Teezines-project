// routes/UserRoutes.js
import express from 'express';

// Import controller functions
import { GetUser, UpdatePassword, UpdateProfile, UserLogin } from '../controller/authController.js';
import { register,  resetPasswordWithOtp,  sendOtpForPasswordReset,  VerifyOtp } from '../controller/auth.js';

// Create a router instance
const   router = express.Router();
//User All Data
router.get("/",GetUser);

// User Register route
router.post("/register", register);

// Verify OTP route after signup
router.post("/verify-otp", VerifyOtp);

// User login route
router.post("/login", UserLogin);

// Update user password route
router.put("/updatepass", UpdatePassword);

// Update user profile route
router.put("/updateprofile/:id", UpdateProfile);

// Forget Password routes
router.post("/forgot-password", sendOtpForPasswordReset);
router.post("/reset-password", resetPasswordWithOtp);

 

export default router;
