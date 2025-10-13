// controllers/ProductController.js
import ProductModel from '../model/ProductModel.js';

/**
 * Get all products
 */
export const GetProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json({ message: "All products retrieved", products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Add a new product
 */

export const ProductAdd = async (req, res) => {
  try {
    const { name, price, category, discount, sizes, productDetails, productDescription } = req.body;

    // Parse sizes array
    const parsedSizes = JSON.parse(sizes);

    // Get uploaded image URLs from Cloudinary
    const imageUrls = req.files.map(file => file.path);

    const newProduct = new ProductModel({
      name,
      price,
      category,
      discount,
      sizes: parsedSizes,
      productDetails,
      productDescription,
      img: imageUrls, 
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
/**
 * Update a product by ID
 */
export const ProductUpdate = async (req, res) => {
  try {
    const updatedProduct = await ProductModel.findOneAndUpdate(
       req.params.id ,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Delete a product by ID
 */
export const ProductDelete = async (req, res) => {
  try {
    const deleted = await ProductModel.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
