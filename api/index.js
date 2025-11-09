import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session"; // ADD THIS
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import supervisorAuthRouter from "./routes/supervisorAuth.route.js";
import adminAuthRouter from "./routes/adminAuth.route.js";
import adminRouter from "./routes/admin.route.js"; // ADD THIS
import supervisorRouter from "./routes/supervisor.route.js";
import chargerRouter from "./routes/charger.route.js";
import earphoneRouter from "./routes/earphone.route.js";
import mouseRouter from "./routes/mouse.route.js";
import smartwatchRouter from "./routes/smartwatch.route.js";
import inventoryRouter from "./routes/Inventory.route.js";
import customerRouter from "./routes/customer.route.js";
import accessoryRouter from "./routes/latestaccessories.js";
import laptopApplicationRouter from "./routes/laptopApplication.route.js";
import phoneRouter from './routes/phone.route.js';
import laptopRouter from './routes/laptop.route.js';
import phoneApplicationRouter from "./routes/phoneApplication.route.js";
import { initChargers } from './crud/chargers.js';
import { initEarphones } from "./crud/earphones.js";
import { initMouses } from "./crud/mouses.js";
import { initSmartwatches } from "./crud/smartwatches.js";
import { initializeSupervisors } from './crud/supervisors.js';
import { initializeAdmins } from './crud/admins.js';
import { initializeApplications } from './crud/applications.js';
import { initPhones } from './crud/phones.js';
import { initLaptops } from './crud/laptops.js';
import orderRouter from "./routes/orders.route.js";

dotenv.config({ path: '../.env' });

mongoose.connect(process.env.MONGO).then(async() => {
  console.log("Connected to MongoDB successfully!!!");
  await initPhones(); 
  await initLaptops(); 
  await initChargers();
  await initEarphones();
  await initMouses();
  await initSmartwatches();
  await initializeSupervisors();
  await initializeAdmins();
  await initializeApplications();
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Session configuration - ADD THIS BEFORE CORS
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/customer", customerRouter);
app.use("/api/auth", authRouter);
app.use("/api/supervisor-auth", supervisorAuthRouter);
app.use("/api/admin-auth", adminAuthRouter);
app.use("/api/admin", adminRouter); // ADD THIS
app.use("/api/supervisor", supervisorRouter); 
app.use("/api/supervisor/inventory", inventoryRouter);
app.use("/api/Accessories/chargers", chargerRouter);
app.use("/api/Accessories/earphones", earphoneRouter);
app.use("/api/Accessories/mouses", mouseRouter);
app.use("/api/Accessories/smartwatches", smartwatchRouter);
app.use("/api/phones", phoneRouter);
app.use("/api/laptops", laptopRouter);
app.use("/api/laptop-applications", laptopApplicationRouter);
app.use("/api/phone-applications", phoneApplicationRouter);
app.use("/api", orderRouter);
app.use("/api", accessoryRouter);
 
// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error('Error:', err);
  
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000!!!");
});