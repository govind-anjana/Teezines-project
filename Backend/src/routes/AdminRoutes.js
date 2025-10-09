import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary"; // ✅ सिर्फ एक बार import

import BannerModel from "../model/BannerModel.js";
import { AdminLogin, Check, SignUpAdmin } from "../controller/AdminController.js";
import { GetProducts, ProductAdd, ProductDelete, ProductUpdate } from "../controller/ProductController.js";
import { verifyAdmin } from "../middleware/auth.js";
import { BannerAll, BannerDelete, BannerUpdate } from "../controller/BannerController.js";

dotenv.config();

const router = express.Router();

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ✅ Multer Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "banners",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });


router.post("/banner", upload.single("img"), async (req, res) => {
  try {
    const { name, email } = req.body;
    const imageUrl = req.file.path; 

    const newBanner = await BannerModel.create({ name, email, img: imageUrl });
    res.status(200).json({ message: "Banner uploaded successfully!", data: newBanner });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/signup", SignUpAdmin);
router.post("/login", AdminLogin);
router.get("/check", verifyAdmin, Check);


router.post("/product", verifyAdmin, ProductAdd);
router.get("/product", verifyAdmin, GetProducts);
router.put("/products/:id", verifyAdmin, ProductUpdate);
router.delete("/products/:id", verifyAdmin, ProductDelete);

//  Banner Routes
router.get("/banner", BannerAll);
router.put("/banner/:id", BannerUpdate);
router.delete("/bannerdelete/:id", BannerDelete);

export default router;
