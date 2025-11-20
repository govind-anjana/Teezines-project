import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import session from 'express-session';
// import passport from 'passport';
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
import sectionRoutes from './routes/SectionRoutes.js'
import contectRouter from './routes/ContectRoutes.js'

dotenv.config();
const app = express();


// Enable CORS for all routes
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// app.use(
//   session({
//     secret: process.env.JWT_SECRET,  // JWT ya koi random string
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

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

app.use("/section",sectionRoutes);

//Use Payment Gatevawy method
app.use("/payment",paymentRoutes);

// Use Promo code With "/promo-code" prefix
app.use("/promo-code",promoRoutes);

app.use("/ai",aiRoutes)

app.use("/orders",orderRoutes)

app.use("/contect",contectRouter);

export default app;
