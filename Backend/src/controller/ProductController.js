// controllers/ProductController.js
import ProductModel from '../model/ProductModel.js';

/**
 * Get all products
 */
export const GetProducts = async (req, res) => {
  try {

    //find are all product
    const products = await ProductModel.find();
    res.status(200).json({ message: "All Products Detail retrieved", products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const ProductById=async(req,res)=>{
       try {
        //find by  id 
    const product = await ProductModel.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product found", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

/**
 * Add a new product
*/

export const ProductAdd = async (req, res) => {
  try {
    const { name, price, category, discount, sizes,rating, productDetails, productDescription } = req.body;

    // Parse sizes if string
    let parsedSizes = [];
    try {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    } catch (err) {
      parsedSizes = [];
    }

    // Cloudinary file URLs
    const imageUrls = req.files?.map(file => file.path) || [];

    // console.log("Uploaded files:", req.files); // debug

    const newProduct = new ProductModel({
      name,
      price,
      category,
      discount,
      sizes: parsedSizes,
      rating,
      productDetails,
      productDescription,
      img: imageUrls,
    });

    await newProduct.save();
    //send Successfully response
    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
    //send Error response
  } catch (err) {
    console.error("ProductAdd Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
/**
 * Update a product by ID
 */
 export const ProductUpdate = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      discount,
      sizes,
      rating,
      productDetails,
      productDescription,
    } = req.body;

    // Parse sizes (string → array)
    let parsedSizes = [];
    try {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    } catch {
      parsedSizes = [];
    }

    // Existing product find
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle new image upload (Cloudinary or multer local)
    let imageUrls = [];

    // Agar nayi image upload hui hai to use update karo
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    } else {
      // Agar new image nahi aayi to purani image hi rakho
      imageUrls = product.img;
    }

    // Update object prepare karo
    const updateData = {
      name,
      price,
      category,
      discount,
      sizes: parsedSizes,
      rating,
      productDetails,
      productDescription,
      img: imageUrls, // final image array
    };

    // Update product
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      message: " Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error(" ProductUpdate Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* Delete a Product by ID */

export const ProductDelete = async (req, res) => {
  try {

    //Find Product by Id and Delete
    const deleted = await ProductModel.findByIdAndDelete(req.params.id);

    //If Product not Found
    if (!deleted)
      return res.status(404).json({ message: "Product not found" });

    //Success Message
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
