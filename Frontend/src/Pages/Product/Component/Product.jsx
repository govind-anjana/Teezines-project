import React, { useState } from "react";
import axios from "axios";

function AddProductForm() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    discount: 0,
    sizes: [{ size: "", stock: 0 }],
    productDetails: "",
    productDescription: "",
  });

  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...product.sizes];
    newSizes[index][field] = value;
    setProduct({ ...product, sizes: newSizes });
  };

  const addSize = () => {
    setProduct({ ...product, sizes: [...product.sizes, { size: "", stock: 0 }] });
  };

  const removeSize = (index) => {
    const newSizes = product.sizes.filter((_, i) => i !== index);
    setProduct({ ...product, sizes: newSizes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in product) {
      if (key === "sizes") {
        formData.append(key, JSON.stringify(product[key]));
      } else {
        formData.append(key, product[key]);
      }
    }
    for (let i = 0; i < files.length; i++) {
      formData.append("img", files[i]);
    }

    try {
        console.log(product)
      const res = await axios.post("http://localhost:8000/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product added successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err)
      // console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          name="price"
          placeholder="Price"
          type="number"
          value={product.price}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          name="discount"
          placeholder="Discount %"
          type="number"
          value={product.discount}
          onChange={handleChange}
        />
       

        {/* Multiple Images */}
        <div>
          <label className="font-semibold mb-2 block">Upload Images</label>
          <input type="file" name="img" multiple onChange={handleFileChange} className="border p-2 rounded w-full" />
        </div>

        {/* Dynamic Sizes */}
        <div>
          <label className="font-semibold mb-2 block">Sizes</label>
          {product.sizes.map((s, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                className="flex-1 border p-2 rounded"
                placeholder="Size"
                value={s.size}
                onChange={(e) => handleSizeChange(index, "size", e.target.value)}
              />
              <input
                className="w-24 border p-2 rounded"
                placeholder="Stock"
                type="number"
                value={s.stock}
                onChange={(e) => handleSizeChange(index, "stock", e.target.value)}
              />
              <button type="button" onClick={() => removeSize(index)} className="bg-red-500 text-white px-2 rounded">
                X
              </button>
            </div>
          ))}
          <button type="button" onClick={addSize} className="bg-blue-500 text-white px-3 py-1 rounded mt-2">
            Add Size
          </button>
        </div>

        <textarea
          className="w-full border p-2 rounded"
          name="productDetails"
          placeholder="Product Details"
          value={product.productDetails}
          onChange={handleChange}
        />
        <textarea
          className="w-full border p-2 rounded"
          name="productDescription"
          placeholder="Product Description"
          value={product.productDescription}
          onChange={handleChange}
        />

        <button type="submit" className="w-full bg-green-500 text-white p-3 rounded font-semibold mt-4">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;
