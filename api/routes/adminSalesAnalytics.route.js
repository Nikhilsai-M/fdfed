import express from "express";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import {
  getCategorySalesPercent,
  getBrandSalesPercentByCategory,
} from "../controllers/adminSalesAnalytics.controller.js";

const router = express.Router();

router.get("/categories", verifyAdmin, getCategorySalesPercent);
router.get("/brands/:category", verifyAdmin, getBrandSalesPercentByCategory);

export default router;