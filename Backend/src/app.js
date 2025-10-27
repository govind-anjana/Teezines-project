import express from 'express';
import cors from 'cors';
// Import User routes
import authRoutes from './routes/UserRoutes.js'
// Import Admin routes
import adminRoutes from './routes/AdminRoutes.js'

import categoryRoutes from './routes/CategoryRoutes.js'
import productRoutes from './routes/ProductRoutes.js';

import bannerRoutes from './routes/BannerRoutes.js'
import promoRoutes from './routes/PromoRoutes.js'
import paymentRoutes from './routes/PaymentRoutes.js'
import orderRoutes from './routes/OrderRoutes.js'
import aiRoutes from './routes/AiRoutes.js'
const app = express()

// Enable CORS for all routes
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Use User routes with '/auth' prefix
app.use("/auth", authRoutes);

// Use Admin routes with '/admin' prefix
app.use("/admin", adminRoutes);

// Use Admin with '/category' prefix
app.use("/category",categoryRoutes);


// Use Product with '/product' prefix
app.use("/product",productRoutes);

// Use Banner With '/banner' prefix
app.use("/banner",bannerRoutes);


//Use Payment Gatevawy method
app.use("/payment",paymentRoutes);

// Use Promo code With "/promo-code" prefix
app.use("/promo-code",promoRoutes);

app.use("/ai",aiRoutes)

app.use("/orders",orderRoutes)
// Export app to be used in server.js

export default app;
