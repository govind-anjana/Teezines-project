// src/pages/UpdateProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  
  useEffect(() => {
      const token = localStorage.getItem("userToken");
      const userdetails=localStorage.getItem("user");
    if (token) {
      try {
        const payload = JSON.parse();
        console.log(payload.username, payload.email);
        setFormData({
          username: payload.username || "",
          email: payload.email || "",
          phone: payload.phone || "",
          address: payload.address || "",
        });
      } catch (err) {
        console.error("Token decode failed:", err);
      }
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.put("http://localhost:8000/auth/updateprofile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Update Profile</h2>

        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="w-full border px-4 py-2 rounded"/>
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border px-4 py-2 rounded"/>
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full border px-4 py-2 rounded"/>
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full border px-4 py-2 rounded"/>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
