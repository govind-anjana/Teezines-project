import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BannerManager() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [img, setImg] = useState(null);
  const [users, setUsers] = useState([]);

  // Fetch existing banners on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/banner");
        setUsers(res.data.banners || res.data); // Adjust depending on backend response
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!img) return alert("Please select an image");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("img", img);
      
    try {
      const res = await axios.post("http://localhost:8000/banner", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Banner added successfully!");
      setUsers([...users, res.data.data]);
      setFormData({ name: "", email: "" });
      setImg(null);
    } catch (err) {
      console.error("Error adding banner:", err);
      alert("Failed to add banner");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Add Banner Image</h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white shadow-md rounded-lg p-6 mb-8"
      >
        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            name="img"
            onChange={(e) => setImg(e.target.files[0])}
            className="w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Banner
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Banner List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white shadow rounded-lg p-4 text-center"
          >
            <img
              src={user.img}
              alt={user.name}
              className="w-32 h-32 object-cover mx-auto rounded-full mb-3"
            />
            <h3 className="font-bold text-lg">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
