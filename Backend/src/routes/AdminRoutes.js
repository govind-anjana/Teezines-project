// routes/AdminRoutes.js
import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";  
import BannerModel from "../model/BannerModel.js";
import { AdminLogin, Check,  UpdateAdmin } from "../controller/AdminController.js";
import { GetProducts, ProductAdd, ProductDelete, ProductUpdate } from "../controller/ProductController.js";
import { verifyAdmin } from "../middleware/auth.js";
import { BannerAll, BannerDelete, BannerUpdate } from "../controller/BannerController.js";

dotenv.config();
const router = express.Router();

// Admin login
router.post("/login", AdminLogin);

// Update admin by ID
router.put("/update/:id", verifyAdmin, UpdateAdmin);

// Verify admin token
router.get("/check", verifyAdmin, Check);


/* --------------------- Banner Routes --------------------- */
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "banners",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// Upload a banner
router.post("/banner", upload.single("img"), async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image file is required" });

    const imageUrl = req.file.path; 
    const newBanner = await BannerModel.create({ name, email, img: imageUrl });

    console.log(newBanner);
    res.status(201).json({ message: "Banner uploaded successfully!", data: newBanner });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

 

export default router;
