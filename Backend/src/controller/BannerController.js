// controllers/BannerController.js
import BannerModel from "../model/BannerModel.js";


export const BannerAdd = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image file is required" });

    const imageUrl = req.file.path;
    const newBanner = await BannerModel.create({ name, email, img: imageUrl });

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
    const updatedBanner = await BannerModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBanner) return res.status(404).json({ message: "Banner not found" });

    res.status(200).json({ message: "Banner updated successfully", banner: updatedBanner });
  } catch (err) {
    console.error("Banner Update Error:", err);
    res.status(500).json({ message: "Error updating banner", error: err.message });
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
