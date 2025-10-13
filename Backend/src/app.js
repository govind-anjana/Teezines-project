import express from 'express';
import cors from 'cors';
// Import User routes
import authRoutes from './routes/UserRoutes.js'
// Import Admin routes
import adminRoutes from './routes/AdminRoutes.js'

import productRoutes from './routes/ProductRoutes.js';

import bannerRoutes from './routes/BannerRoutes.js'
const app = express()

// Enable CORS for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Use User routes with '/auth' prefix
app.use("/auth", authRoutes);

// Use Admin routes with '/admin' prefix
app.use("/admin", adminRoutes);

// Use Product with '/product' prefix
app.use("/product",productRoutes)

// Use Banner With '/banner' prefix
app.use("/banner",bannerRoutes)

// Export app to be used in server.js


export default app;
