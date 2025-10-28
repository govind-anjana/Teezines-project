import SectionProModel from "../model/SectionProModel.js";

export const GetProductsBySection = async (req, res) => {
  try {
    const { section } = req.params; // e.g. "comic-style"

    // Find section by name and populate products
    const sectionData = await SectionProModel.findOne({ section })
      .populate("products"); // replace ObjectIds with actual product details

    if (!sectionData) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `${section} products fetched successfully`,
      data: sectionData.products, // only return products list
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const GetSectionProduct = async (req, res) => {
  try {

    //find are all product
    const products = await SectionProModel.find();
    res.status(200).json({ message: "All Section Product Detail retrieved", products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Create Section Controller
 export const AddSectionPro = async (req, res) => {
  try {
    const { section, products } = req.body;

    if (!section || !products) {
      return res.status(400).json({
        success: false,
        message: "Section name and Product ID are required",
      });
    }
const existingSection = await SectionProModel.findOne({ section });

    if (!existingSection) {
      return res.status(404).json({
        success: false,
        message: `Section "${section}" not found. Please create it first.`,
      });
    }
    // Update if exists, or create new if not found
    const updatedSection = await SectionProModel.findOneAndUpdate(
      { section },
      { $addToSet: { products } }, // add unique product ID
      { new: true, upsert: true }  //  upsert:true => create new if not exists
    ).populate("products");

    res.status(200).json({
      success: true,
      message: "Product added successfully to section",
      data: updatedSection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const SectionProUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID exists
    if (!id) {
      return res.status(400).json({ success: false, message: "Section ID is required" });
    }

    // Update section
    const updatedSection = await SectionProModel.findByIdAndUpdate(id, req.body, { new: true });

    // Check if section found
    if (!updatedSection) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const RemoveProductFromSection = async (req, res) => {
  try {
    const { section, productId } = req.body;

    if (!section || !productId) {
      return res.status(400).json({
        success: false,
        message: "Section name and Product ID are required",
      });
    }

    // Find section by name and remove product from products array
    const updatedSection = await SectionProModel.findOneAndUpdate(
      { section }, // find by section name (e.g., "comic")
      { $pull: { products: productId } }, // remove productId from array
      { new: true } // return updated doc
    ).populate("products");

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Product removed from ${section} section successfully`,
      data: updatedSection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};