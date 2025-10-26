import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import chargerRouter from "./routes/charger.route.js";
import earphoneRouter from "./routes/earphone.route.js";
import mouseRouter from "./routes/mouse.route.js";
import smartwatchRouter from "./routes/smartwatch.route.js";
import { initChargers } from './crud/chargers.js';
import { initEarphones } from "./crud/earphones.js";
import { initMouses } from "./crud/mouses.js";
import { initSmartwatches } from "./crud/smartwatches.js";
dotenv.config({ path: '../.env' });

mongoose.connect(process.env.MONGO).then(async() => {
  console.log("Connected to MongoDB successfully!!!");
 await initChargers();
 await initEarphones();
 await initMouses();
 await initSmartwatches();
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000!!!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter); 
app.use("/api/Accessories/chargers", chargerRouter);
app.use("/api/Accessories/earphones", earphoneRouter);
app.use("/api/Accessories/mouses", mouseRouter);
app.use("/api/Accessories/smartwatches",smartwatchRouter);

app.use((err,req,res,next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
  }); 
});