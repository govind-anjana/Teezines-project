import  ProductModel from '../model/ProductModel.js'

export const GetProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json({message:"All Product show", products});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const ProductUpdate = async (req, res) => {
  try {
    const updated = await ProductModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.json({ message: "Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const ProductAdd=async(req,res)=>{
    const newProduct = new ProductModel(req.body);
  await newProduct.save();
  console.log(newProduct);
  res.json({ message: "Product added Successfully", product: newProduct });
};

export const ProductDelete= async (req, res) => {
  await ProductModel.deleteOne({ id: req.params.id });
  res.json({ message: "Product deleted" });
}