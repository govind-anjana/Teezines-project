import AdminModel from '../model/AdminModel.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();


export const SignUpAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingAdmin = await AdminModel.findOne({ username });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = new AdminModel({ username, password: hashed });
    await newAdmin.save();
    res.json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const AdminLogin=async(req,res)=>{
    const { username, password } = req.body;
  const admin = await AdminModel.findOne({ username });
  if (!admin) return res.status(400).json({ message: "Admin not found" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: "2h" });
  res.json({ message: "Login successful", token });
}


export const UpdateUser = async (req, res) => {
  try {
    const { oldPassword, newPassword, username, email } = req.body;
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid user ID" });

    const user = await AdminModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Old password is incorrect" });

      user.password = await bcrypt.hash(newPassword, 10);
    }

    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();
    res.json({
      message: "User updated successfully",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const Check= (req, res) => {
  res.json({ message: "Admin verified", admin: req.admin });
};