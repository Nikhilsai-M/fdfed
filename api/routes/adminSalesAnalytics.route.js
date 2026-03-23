import express from "express";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import {
  getCategorySalesPercent,
  getBrandSalesPercentByCategory,
} from "../controllers/adminSalesAnalytics.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin Sales Analytics
 *   description: Admin sales analytics APIs
 */

/**
 * @swagger
 * /api/admin/sales-analytics/categories:
 *   get:
 *     summary: Get sales percentage by category
 *     tags: [Admin Sales Analytics]
 *     security:
 *       - bearerAuth: []
 *       - adminTokenCookie: []
 *     responses:
 *       200:
 *         description: Category sales percentages fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/categories", verifyAdmin, getCategorySalesPercent);

/**
 * @swagger
 * /api/admin/sales-analytics/brands/{category}:
 *   get:
 *     summary: Get brand sales percentage for a category
 *     tags: [Admin Sales Analytics]
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
 *         description: Brand sales percentages fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/brands/:category", verifyAdmin, getBrandSalesPercentByCategory);

export default router;
