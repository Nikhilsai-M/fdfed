import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import chargerRouter from "./routes/charger.route.js";
import { initChargers } from './crud/chargers.js';

dotenv.config({ path: '../.env' });

mongoose.connect(process.env.MONGO).then(async() => {
  console.log("Connected to MongoDB successfully!!!");
  await initChargers();
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration (if frontend is on different port)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Vite default port
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter); 
app.use("/api/Accessories/chargers", chargerRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error('Error:', err); // Log the error for debugging
  
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
  }); 
});

app.listen(3000, () => {
  console.log("Server is running on port 3000!!!");
});