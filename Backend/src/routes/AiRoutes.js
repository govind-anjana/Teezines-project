import express from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import {  getAllAiUsage, UseAI } from "../controller/AiUseUserController.js";
import { CurrentStatus, Toggle } from "../controller/AiToggleController.js";
import {   GetAiLimit, SetAiLimit} from "../controller/AiCreateDetelineController.js";
import { UserapplyPromo } from "../middleware/authUser.js";
import { AiUsageHandler, GetAllAiUsage } from "../controller/AiUsageController.js";

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

router.post("/set",SetAiLimit);

router.get("/get",GetAiLimit);


router.post("/use-user",UserapplyPromo,UseAI);

router.get("/usageall", getAllAiUsage);
//Admin Verify middleware
router.get("/use",  GetAllAiUsage);

router.post("/use",UserapplyPromo,AiUsageHandler);



// User uses AI
// router.post("/use", authMiddleware,UseUser);

// Admin route: count all AI users
// router.get("/all", UserAll);

export default router;
