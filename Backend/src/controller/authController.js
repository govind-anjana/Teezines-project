// controllers/UserController.js
import User from "../model/UserModel.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

 export const GetUser = async (req, res) => {
  try {
    const data = await User.find();
    if (!data.length) return res.status(404).json({ message: "No users found" });
    res.status(200).json({ message: "All users", data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * User Login
 */
export const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password are not match" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Please verify your email before logging in." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.status(200).json({
      message: "Login successful",
      token,
      hasUsedAI: user.hasUsedAI,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Update Password & optionally username/email*/
export const UpdatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, username, email } = req.body;
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid user ID" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    if (email && email !== user.email) {
      return res.status(400).json({ message: "Email does not match the user record" });
    }


    // Update password if provided
    if (newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Update username/email if provided
    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Update User Profile
 * Requires JWT middleware to set req.user
 */
export const UpdateProfile = async (req, res) => {
  try {
    const {id} = req.params;  
    const { username, email, phone, address,dateOfBirth } = req.body;
    if (!email)
      return res.status(400).json({ message: "email are required" });

    const updatedUser = await User.findByIdAndUpdate(
     id,
      { username, email, phone, address,dateOfBirth },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

