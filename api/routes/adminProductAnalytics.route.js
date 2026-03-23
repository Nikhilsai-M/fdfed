import express from "express";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import {
  getBrandWiseByCategory,
  getProductTotals,
} from "../controllers/adminProductAnalytics.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin Product Analytics
 *   description: Admin product analytics APIs
 */

/**
 * @swagger
 * /api/admin/product-analytics/totals:
 *   get:
 *     summary: Get product totals by category
 *     tags: [Admin Product Analytics]
 *     security:
 *       - bearerAuth: []
 *       - adminTokenCookie: []
 *     responses:
 *       200:
 *         description: Product totals fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/totals", verifyAdmin, getProductTotals);

/**
 * @swagger
 * /api/admin/product-analytics/brands/{category}:
 *   get:
 *     summary: Get brand-wise totals for a category
 *     tags: [Admin Product Analytics]
 *     security:
 *       - bearerAuth: []
 *       - adminTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand-wise totals fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/brands/:category", verifyAdmin, getBrandWiseByCategory);

export default router;
