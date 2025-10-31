// Import necessary modules
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
// import transporter from "../utils/miler.js"; // nodemailer transporter
import User from "../model/UserModel.js";

dotenv.config()

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
let tempUsers = {}; 
// User register controller

export const register = async (req, res) => {
  try {
    const { username, email, dateOfBirth, password } = req.body;

    // Validate input
    if (!username || !email || !dateOfBirth || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user directly (no OTP verification)
    const newUser = new User({
      username,
      email,
      dateOfBirth,
      password: hashedPassword,
      isVerified: true, // directly verified since no OTP
    });

    await newUser.save();

    return res.status(201).json({ 
      success: true, 
      message: "User registered successfully", 
      user: { username, email } 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const forgetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    //  Check required fields
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //  Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Confirm Passwords do not match" });
    }

    //  Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5 Update password in DB
    user.password = hashedPassword;
    await user.save();

    // 6 Respond to client
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


// Verify OTP controller
//  export const VerifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp)
//       return res.status(400).json({ message: "Email and OTP required" });

//     const tempUser = tempUsers[email];
//     if (!tempUser)
//       return res.status(404).json({ message: "No pending registration found" });

//     if (tempUser.otpExpiresAt < Date.now())
//       return res.status(400).json({ message: "OTP expired. Please register again." });

//     const hashed = hashOtp(otp);
//     if (hashed !== tempUser.otpHash)
//       return res.status(400).json({ message: "Invalid OTP" });

//     //  Save to database now
//     const user = new User({
//       username: tempUser.username,
//       email: tempUser.email,
//       dateOfBirth: tempUser.dateOfBirth,
//       password: tempUser.password,
//       isVerified: true,
//     });

//     await user.save();

//     // delete from temp storage
//     delete tempUsers[email];

//     return res.status(201).json({ message: "Email verified and user registered successfully!" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// export const sendOtpForPasswordReset = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user)
//       return res.status(400).json({ success: false, message: "User not found" });

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Hash OTP for secure storage
//     const otpHash = await bcrypt.hash(otp, 10);

//     user.otpHash = otpHash;
//     user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // valid for 10 mins
//     await user.save();

//     // Send OTP to user's email
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Password Reset OTP",
//       html: `
//         <h2>Password Reset Request</h2>
//         <p>Your OTP is <b>${otp}</b></p>
//         <p>This OTP will expire in 10 minutes.</p>
//       `,
//     });

//     res.json({ success: true, message: "OTP sent to email" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Error sending OTP" });
//   }
// };
// export const resetPasswordWithOtp = async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body;
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(400).json({ success: false, message: "User not found" });

//     if (!user.otpHash)
//       return res.status(400).json({ success: false, message: "No OTP generated" });

//     if (user.otpExpiresAt < Date.now())
//       return res.status(400).json({ success: false, message: "OTP expired" });

//     // Compare OTP
//     const isMatch = await bcrypt.compare(otp, user.otpHash);
//     if (!isMatch)
//       return res.status(400).json({ success: false, message: "Invalid OTP" });

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;

//     // Clear OTP fields
//     user.otpHash = undefined;
//     user.otpExpiresAt = undefined;

//     await user.save();

//     res.json({ success: true, message: "Password reset successful" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Error resetting password" });
//   }
// };