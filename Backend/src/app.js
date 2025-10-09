import express from 'express';
import cors from 'cors';
import UserRouter from './routes/UserRoutes.js'
import Admin from './routes/AdminRoutes.js'
const app=express()

app.use(cors());
app.use(express.json());
app.use("/auth",UserRouter);
app.use("/admin",Admin)
// app.use("/payment",paymentRouter)
// app.use("/auth",authRouter)
export default app;