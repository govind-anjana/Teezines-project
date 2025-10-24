import CategoryModel from "../model/CategoryModel.js";

export const Getcategory=async(req,res)=>{
         try {
    //find are all Category
    const products = await CategoryModel.find();
    res.status(200).json({ message: "All Category Detail retrieved", products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export const CategoryAdd = async (req, res) => {
  try {
    const { category } = req.body;

    // Validation
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Check if already exists
    const exists = await CategoryModel.findOne({ category });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create new category
    const newCategory = new CategoryModel({ category });
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category added successfully!",
    });
  } catch (err) {
    
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}