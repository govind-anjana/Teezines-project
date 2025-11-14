// routes/UserRoutes.js
import express from 'express';
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import UserModel from "../model/UserModel.js"; // Your Mongoose User model
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Import controller functions
import { GetUser, GetUserById, UpdatePassword, UpdateProfile, UserLogin } from '../controller/authController.js';
import { forgetPassword, register } from '../controller/auth.js';
import { sendotp, VerifyOtp } from '../controller/authotp.js';
import { verifyAdmin } from '../middleware/auth.js';
// import { SendOtp } from '../controller/mailController.js';

// import { registerUser } from '../controller/OtpController.js';

// Create a router instance
const   router = express.Router();
//User All Data
router.get("/",verifyAdmin,GetUser);

router.get("/:id",GetUserById);
router.post("/send-otp", sendotp);
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
router.post("/forgot-password",forgetPassword);
// router.post("/reset-password", resetPasswordWithOtp);

 

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT,       // GOOGLE CLIENT ID
      clientSecret: process.env.GOOGLE_SECRET,   // GOOGLE CLIENT SECRET
      callbackURL: "https://teezines-project.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await UserModel.findOne({ email });

        // If user does not exist → signup
        if (!user) {
          user = await UserModel.create({
            username: profile.displayName,
            email: email,
            password: null,    // Google users ka password null
            isVerified: true,
            googleId: profile.id,
            authType: "google",
          });
        }
      
        done(null, user);
      } catch (err) {
        done(err, null);
        
      }
    }
  )
);

// -------------------------
//  Route: Start Google login
// -------------------------
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// -------------------------
//  Route: Google callback
// -------------------------
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send token & user to frontend popup
    res.send(`
      <script>
        window.opener.postMessage(
          ${JSON.stringify({ token, user: req.user })},
          "http://localhost:5173"
        );
        window.close();
      </script>
    `);
  }
);

export default router;
