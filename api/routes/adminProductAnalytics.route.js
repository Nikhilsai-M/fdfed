import express from "express";
import { verifyAdmin } from "../middleware/admin.middleware.js"; // adjust if your file name is different
import { getBrandWiseByCategory, getProductTotals } from "../controllers/adminProductAnalytics.controller.js";

const router = express.Router();

router.get("/totals", verifyAdmin, getProductTotals);
router.get("/brands/:category", verifyAdmin, getBrandWiseByCategory);

export default router;