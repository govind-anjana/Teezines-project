// Import necessary modules
import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import transporter from "../utils/miler.js"; // nodemailer transporter
import User from "../model/UserModel.js";

// ------------------ Helper Functions ------------------

// Generate a 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash the OTP using SHA256
function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

// ------------------ Controllers ------------------

// User signup controller
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with isVerified=false
    const user = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    // Generate OTP for email verification
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    user.otpHash = otpHash;
    user.otpExpiresAt = otpExpiresAt;

    // Save user in DB
    await user.save();

    // Prepare email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email - OTP",
      html: `
        <p>Hi ${username},</p>
        <p>Your OTP for email verification is: <b>${otp}</b></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't sign up, ignore this email.</p>
      `,
    };

    // Send OTP email
    await transporter.sendMail(mailOptions);

    return res
      .status(201)
      .json({ message: "Signup successful! OTP sent to email." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};


   
// Verify OTP controller
export const VerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP required" });

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if OTP exists
    if (!user.otpHash || !user.otpExpiresAt)
      return res
        .status(400)
        .json({ message: "No OTP requested or already used" });

    // Check if OTP expired
    if (user.otpExpiresAt < new Date())
      return res
        .status(400)
        .json({ message: "OTP expired. Request a new one." });

    // Verify OTP
    const hashed = hashOtp(otp);
    if (hashed !== user.otpHash)
      return res.status(400).json({ message: "Invalid OTP" });

    // Mark user as verified
    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
