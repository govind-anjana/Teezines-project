import express from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { UserAll, UseUser } from "../controller/AiUseUserController.js";
import { CurrentStatus, Toggle } from "../controller/AiToggleController.js";
// import {CurrentStatus} from '../controller/AiToogleController.js'

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
};

//
router.get("/status",CurrentStatus);

router.post("/toggle-status",Toggle);


router.post("/create",CreateUserAi)
// User uses AI
router.post("/use", authMiddleware,UseUser);

// Admin route: count all AI users
router.get("/all", UserAll);

export default router;
