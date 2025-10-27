import express from "express";
import jwt from "jsonwebtoken";
import User from "../model/UserModel.js";
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Auth middleware
const authMiddleware = async (req,res,next)=>{
  try{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message:"No token"});
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  }catch(err){
    res.status(401).json({message:"Invalid token"});
  }
}

// User uses AI
router.post("/use", authMiddleware, async(req,res)=>{
  try{
    const user = await User.findById(req.userId);
    if(!user) return res.status(404).json({message:"User not found"});

    if(!user.hasUsedAI){
      user.hasUsedAI = true; //  mark AI use
      await user.save();
    }

    res.json({success:true, message:"AI used successfully"});
  }catch(err){
    res.status(500).json({error:err.message});
  }
});

// Admin route: count all AI users
router.get("/all", async(req,res)=>{
  try{
    const aiUsers = await User.find({hasUsedAI:true}, "username email");
    res.json({success:true, totalUsers: aiUsers.length, users: aiUsers});
  }catch(err){
    res.status(500).json({error:err.message});
  }
});

export default router;
