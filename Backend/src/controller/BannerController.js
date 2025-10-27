// controllers/BannerController.js
import BannerModel from "../model/BannerModel.js";
import ProductModel from "../model/ProductModel.js";


export const BannerAdd = async (req, res) => {
  try {
    const { productId,isActive } = req.body;

     const productExists = await ProductModel.findById(productId);
    if (!productExists) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    // console.log("File received:", req.file);
    if (!req.file) return res.status(400).json({ message: "Image file is required" });

    const imageUrl = req.file.path;
    const newBanner = await BannerModel.create({productId,isActive , img: imageUrl });

    res.status(201).json({ message: "Banner uploaded successfully!", data: newBanner });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
/**
 * Get all banners
 */
export const BannerAll = async (req, res) => {
  try {
    const banners = await BannerModel.find();
    res.status(200).json({ message: "All banners retrieved", banners });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Update a banner by ID
 */
 export const BannerUpdate = async (req, res) => {
  try {
    // console.log("Incoming data:", req.body);
    // console.log("File received:", req.file);

    const { productId, isActive } = req.body;
    const bannerId = req.params.id;

    // 1️⃣ Find the banner
    const banner = await BannerModel.findById(bannerId);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // 2️⃣ Update product (if provided)
    if (productId) {
      const productExists = await ProductModel.findById(productId);
      if (!productExists) {
        return res.status(404).json({ message: "Product not found" });
      }
      banner.productId = productId;
    }

    // 3️⃣ Update image (if uploaded)
    if (req.file) {
      // multer-storage-cloudinary provides secure_url or path
      banner.img = req.file.path || req.file.secure_url;
    }

    // 4️⃣ Update active status
    if (isActive !== undefined) {
      banner.isActive = isActive === "true" || isActive === true;
    }

    // 5️⃣ Save changes
    const updatedBanner = await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner updated successfully!",
      banner: updatedBanner,
    });
  } catch (err) {
    console.error("Banner Update Error:", err);
    res.status(500).json({
      success: false,
      message: "Error updating banner",
      error: err.message,
    });
  }
};

/**
 * Delete a banner by ID
 */
export const BannerDelete = async (req, res) => {
  try {
    const deletedBanner = await BannerModel.findByIdAndDelete(req.params.id);
    if (!deletedBanner) return res.status(404).json({ message: "Banner not found" });

    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (err) {
    console.error("Banner Delete Error:", err);
    res.status(500).json({ message: "Error deleting banner", error: err.message });
  }
};
