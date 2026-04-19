import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { createStream } from "rotating-file-stream";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { swaggerSpec } from "./config/swagger.js";
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
import phoneRouter from "./routes/phone.route.js";
import laptopRouter from "./routes/laptop.route.js";
import phoneApplicationRouter from "./routes/phoneApplication.route.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/orders.route.js";
import searchRouter from "./routes/search.route.js";
import adminStatisticsRouter from "./routes/adminStatistics.route.js";
import deviceRequestRoutes from "./routes/deviceRequest.route.js";
import notificationRoutes from "./routes/notification.route.js";
import sellerAuthRouter from "./routes/sellerAuth.route.js";
import sellerProductRoutes from "./routes/sellerProduct.route.js";
import sellerDashboardRoutes from "./routes/sellerDashboard.route.js";
import adminProductAnalyticsRouter from "./routes/adminProductAnalytics.route.js";
import adminSalesAnalyticsRouter from "./routes/adminSalesAnalytics.route.js";
import SellerOrderRoutes from "./routes/sellerOrders.route.js";
import SellerProfileRoutes from "./routes/sellerProfile.route.js";
import adminSellerActivityRoutes from "./routes/adminSellerActivity.route.js";
import paymentRouter from "./routes/payment.route.js";
import cartRouter from "./routes/cart.route.js";
import healthRouter from "./routes/health.route.js";
import {
  getAllowedOrigins,
  getSessionCookieOptions,
  isAllowedOrigin,
} from "./utils/http.js";

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      requestInterceptor: (req) => {
        req.credentials = "include";
        return req;
      },
    },
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const accessLogStream = createStream(
  (time) => {
    if (!time) return "access.log";
    const date = time.toISOString().slice(0, 10);
    return `access-${date}.log`;
  },
  {
    interval: "1d",
    path: path.join(__dirname, "log"),
  }
);

morgan.token("custom", (req, res) => {
  const now = new Date().toISOString();
  return `[${now}] ${req.method} ${req.originalUrl} | Status: ${res.statusCode}`;
});

app.use(morgan("dev"));
app.use(morgan(":custom :response-time ms", { stream: accessLogStream }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: getSessionCookieOptions(),
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/health", healthRouter);
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
app.use("/api", orderRouter);
app.use("/api", accessoryRouter);
app.use("/api", productRouter);
app.use("/api/search", searchRouter);
app.use("/api/admin", adminStatisticsRouter);
app.use("/api/device-requests", deviceRequestRoutes);
app.use("/api/customer/notifications", notificationRoutes);
app.use("/api/seller", sellerAuthRouter);
app.use("/api/seller", sellerProductRoutes);
app.use("/api/seller", sellerDashboardRoutes);
app.use("/api/seller", SellerOrderRoutes);
app.use("/api/seller", SellerProfileRoutes);
app.use("/api/admin/product-analytics", adminProductAnalyticsRouter);
app.use("/api/admin/sales-analytics", adminSalesAnalyticsRouter);
app.use("/api/admin/seller-activity", adminSellerActivityRoutes);
app.use("/api/payment", paymentRouter);
app.use("/api/cart", cartRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("Error:", err);

  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });
});

export default app;
