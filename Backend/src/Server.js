import express from "express";
import ConnectionData from "../src/config/Db.js";
import app from './app.js'
const PORT = process.env.PORT || 8000;
ConnectionData();
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
