// Import Express app from app.js
import express from "express";

// Import database connection function
import ConnectionData from "../src/config/Db.js";

// Import the configured Express app
import app from './app.js'

// Define port from environment variable or fallback to 8000
const PORT = process.env.PORT || 8000;

// Connect to database
ConnectionData();

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
