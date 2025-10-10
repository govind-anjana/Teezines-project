// controllers/AdminController.js
import AdminModel from '../model/AdminModel.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
/**
 * Check if admin token is valid
 * Assumes verifyAdmin middleware sets req.admin
 */
export const Check = (req, res) => {
  res.status(200).json({ message: "Admin verified", admin: req.admin });
};


/**
 * Sign up a new admin
 */
// export const SignUpAdmin = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password)
//       return res.status(400).json({ message: "Username and password are required" });

//     const existingAdmin = await AdminModel.findOne({ username });
//     if (existingAdmin)
//       return res.status(400).json({ message: "Admin already exists" });

//     const hashed = await bcrypt.hash(password, 10);
//     const newAdmin = new AdminModel({ username, password: hashed });
//     await newAdmin.save();

//     res.status(201).json({ message: "Admin created successfully", admin: { id: newAdmin._id, username: newAdmin.username } });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

/**
 * Admin login
 */
export const AdminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password are required" });

    const admin = await AdminModel.findOne({ username });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.status(200).json({ message: "Login successful", token, admin: { id: admin._id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* Update admin profile or password */
export const UpdateAdmin = async (req, res) => {
  try {
    const { oldPassword, newPassword, username } = req.body;
    const adminId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(adminId))
      return res.status(400).json({ message: "Invalid admin ID" });

    const admin = await AdminModel.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Update password if provided
    if (newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, admin.password);
      if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

      admin.password = await bcrypt.hash(newPassword, 10);
    }

    // Update username if provided
    admin.username = username || admin.username;

    await admin.save();

    res.status(200).json({
      message: "Admin profile updated successfully",
      admin: { id: admin._id, username: admin.username },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

 