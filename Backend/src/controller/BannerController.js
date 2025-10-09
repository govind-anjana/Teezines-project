import BannerModel from "../model/BannerModel.js";
import express from "express";

export const BannerAdd = async (req, res) => {
  try {
    // Check if image exists
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const { name, email } = req.body; // Banner model fields
    const newBanner = new BannerModel({
      name,
      email,
      img: req.file.path, // Cloudinary URL
    });
      console.log("File:", req.file);
console.log("Body:", req.body);
    const savedBanner = await newBanner.save();
    res.status(201).json({ message: "Banner Added", data: savedBanner });
  } catch (err) {
    console.error(err); // Always log error
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
export const BannerAll=async(req, res) => {
  try {
    const users = await BannerModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export const BannerUpdate = async (req, res) => {
  try {
    const banner = await BannerModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json({ message: "Banner updated successfully", banner });
  } catch (err) {
    res.status(500).json({ message: "Error updating banner", error: err.message });
  }
};

export const BannerDelete = async (req, res) => {
  try {
    const banner = await BannerModel.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting banner", error: err.message });
  }
};