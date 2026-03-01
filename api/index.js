import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session"; 
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import supervisorAuthRouter from "./routes/supervisorAuth.route.js";
import adminAuthRouter from "./routes/adminAuth.route.js";
import adminRouter from "./routes/admin.route.js"; 
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
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/orders.route.js";
import searchRouter from "./routes/search.route.js";
import adminStatisticsRouter from "./routes/adminStatistics.route.js";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import deviceRequestRoutes from "./routes/deviceRequest.route.js";
import notificationRoutes from "./routes/notification.route.js"
import helmet from "helmet"
import cors from "cors";
import sellerAuthRouter from "./routes/sellerAuth.route.js";
import sellerProductRoutes from "./routes/sellerProduct.route.js";
import sellerDashboardRoutes from "./routes/sellerDashboard.route.js";
import adminProductAnalyticsRouter from "./routes/adminProductAnalytics.route.js";
import adminSalesAnalyticsRouter from "./routes/adminSalesAnalytics.route.js";
import SellerOrderRoutes from "./routes/sellerOrders.route.js"
import SellerProfileRoutes from "./routes/sellerProfile.route.js"
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
app.use(helmet());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const accessLogStream = createStream((time, index) => {
  if (!time) return "access.log";
  const date = time.toISOString().slice(0, 10);
  return `access-${date}.log`;
}, {
  interval: "1d",
  path: path.join(__dirname, "log"),
});

morgan.token("custom", (req, res) => {
  const now = new Date().toISOString(); 
  return `[${now}] ${req.method} ${req.originalUrl} | Status: ${res.statusCode}`;
});


app.use(morgan("dev")); 
app.use(morgan(":custom :response-time ms", { stream: accessLogStream })); 

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));


app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



app.use("/api/user", userRouter);
app.use("/api/customer", customerRouter);
app.use("/api/auth", authRouter);
app.use("/api/supervisor-auth", supervisorAuthRouter);
app.use("/api/admin-auth", adminAuthRouter);
app.use("/api/admin", adminRouter); 
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
app.use("/api",orderRouter);
app.use("/api",accessoryRouter);
app.use("/api", productRouter);
app.use("/api/search", searchRouter);
app.use("/api/admin", adminStatisticsRouter);
app.use("/api/device-requests", deviceRequestRoutes);
app.use("/api/customer/notifications", notificationRoutes);
app.use("/api/seller", sellerAuthRouter);
app.use("/api/seller", sellerProductRoutes);
app.use("/api/seller", sellerDashboardRoutes);
app.use("/api/seller",SellerOrderRoutes);
app.use("/api/seller",SellerProfileRoutes);
app.use("/api/admin/product-analytics", adminProductAnalyticsRouter);
app.use("/api/admin/sales-analytics", adminSalesAnalyticsRouter);

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