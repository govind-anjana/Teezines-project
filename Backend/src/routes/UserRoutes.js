// routes/UserRoutes.js
import express from 'express';

// Import controller functions
import { GetUser, UpdatePassword, UpdateProfile, UserLogin } from '../controller/authController.js';
import { register,  resetPasswordWithOtp,  sendOtpForPasswordReset,  VerifyOtp } from '../controller/auth.js';
// import { SendOtp } from '../controller/mailController.js';

// import { registerUser } from '../controller/OtpController.js';

// Create a router instance
const   router = express.Router();
//User All Data
router.get("/",GetUser);


// router.post("/send-otp")


// router.post("/send-otp", SendOtp);
// User Register route
router.post("/register", register);
// router.post("/registers", registerUser);

// Verify OTP route after signup
router.post("/verify-otp", VerifyOtp);

// User login route
router.post("/login", UserLogin);

// Update user password route
router.put("/updatepass/:id", UpdatePassword);

// Update user profile route
router.put("/updateprofile/:id", UpdateProfile);

// Forget Password routes
router.post("/forgot-password", sendOtpForPasswordReset);
router.post("/reset-password", resetPasswordWithOtp);

 

export default router;
