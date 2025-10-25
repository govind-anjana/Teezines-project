import PromoCodeModel from "../model/PromoModel.js";
import ProductModel from "../model/ProductModel.js";
/* Get All Promo Details */

export const PromoShow=async(req,res)=>{
    try {

    //find are all product
    const promo = await PromoCodeModel.find();
    res.status(200).json({ message: "All Promo Code Details retrieved", promo });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export const PromoCreate = async (req, res) => {
    try {
    const {
      code,
      discountValue,
      expiryDate,
      usageLimit,
      applicableCategory,
      applicableProduct,
    } = req.body;

    //  Check existing promo
    const existingPromo = await PromoCodeModel.findOne({ code });
    if (existingPromo)
      return res.status(400).json({ success: false, message: "Promo code already exists" });

    //  Create new promo
    const promo = new PromoCodeModel({
      code,
      discountValue,
      expiryDate,
      usageLimit,
      applicableCategory: applicableCategory || null,
      applicableProduct: applicableProduct || null,
    });

    await promo.save();

    return res.status(201).json({
      success: true,
      message: "Promo code created successfully",
      promo,
    });
  } catch (error) {
    console.error("Create Promo Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const Applypromo = async (req, res) => {
  try {
    const { code,productId, totalAmount } = req.body;
    const userEmail = req.user.email;

     //  Find promo
    const promo = await PromoCodeModel.findOne({ code });
    if (!promo || !promo.isActive)
      return res.status(400).json({ success: false, message: "Invalid promo code" });

    if (promo.expiryDate < new Date())
      return res.status(400).json({ success: false, message: "Promo code expired" });

    //  Check usage limit
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit)
      return res.status(400).json({ success: false, message: "Promo usage limit reached" });

    if (promo.usedBy.includes(userEmail))
      return res.status(400).json({ success: false, message: "Promo already used by this user" });

    // Product fetch
    const product = await ProductModel.findById(productId).populate("category");
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    //  Category/Product check
    if (promo.applicableCategory && product.category._id.toString() !== promo.applicableCategory.toString()) {
      return res.status(400).json({ success: false, message: "Promo not valid for this category" });
    }

    if (promo.applicableProduct && product._id.toString() !== promo.applicableProduct.toString()) {
      return res.status(400).json({ success: false, message: "Promo not valid for this product" });
    }

  
     //  Fixed Discount
    let discount = promo.discountValue; 
    if (discount > totalAmount) discount = totalAmount; 
    const finalAmount = totalAmount - discount;
     
   //  Update usage
promo.usedCount += 1;
promo.usedBy.push(userEmail);
await promo.save();

    //  Response
    return res.status(200).json({
      success: true,
      message: `Promo applied successfully !  ₹${discount} off`,
      discount,
      finalAmount,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const PromoUpdate=async(req,res)=>{
  try {
    const { code, discountValue, expiryDate, applicableCategory, applicableProduct } = req.body;

    if (code === undefined && discountValue === undefined && expiryDate === undefined &&
        applicableCategory === undefined && applicableProduct === undefined) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }

    const updateData = {};
    if (code !== undefined) updateData.code = code;
    if (discountValue !== undefined) updateData.discountValue = discountValue;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate;

    if (applicableCategory !== undefined) {
      updateData.applicableCategory = applicableCategory; // null allowed
    }

    if (applicableProduct !== undefined) {
      updateData.applicableProduct = applicableProduct; // null allowed
    }

    const updatedPromo = await PromoCodeModel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedPromo) return res.status(404).json({ message: "Promo not found" });

    res.status(200).json({ message: "Promo updated successfully", promo: updatedPromo });
  } catch (err) {
    console.error("Promo update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export const PromoDelete=async(req,res)=>{
   try {

    //Find Promo Code by Id and Delete
    const deleted = await PromoCodeModel.findByIdAndDelete(req.params.id);
    //If Promo not Found
    if (!deleted)
      return res.status(404).json({ message: "Promo Code not found" });

    //Success Message
    res.status(200).json({ message: "Promo Code deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
