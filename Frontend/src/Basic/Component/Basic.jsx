import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Basic() {
  const [data, setData] = useState({ name: "", email: "" });
  const [img, setImg] = useState(null);
  const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/admin/banner");
//         setUsers(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchUsers();
//   }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("img", img);
for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
            console.log(formData);
    try {
      const res = await axios.post("http://localhost:8000/admin/banner", formData);
      console.log(res)
      alert("User added successfully!");
      console.log(res.data);
      setUsers([...users, res.data.data]); 
      setData({ name: "", email: "" });
      setImg(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Add User</h1>
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
            value={data.name}
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
            value={data.email}
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
          Add User
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">User List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user._id} className="bg-white shadow rounded-lg p-4 text-center">
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
