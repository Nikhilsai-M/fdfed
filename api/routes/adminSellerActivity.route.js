import express from "express";
import {
  getTopSellerActivity,
  getSellerTrend,
} from "../controllers/adminSellerActivity.controller.js";
import * as adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

const adminAuth =
  adminMiddleware.adminAuth ||
  adminMiddleware.adminauth ||
  adminMiddleware.isAdmin ||
  adminMiddleware.verifyAdmin ||
  adminMiddleware.adminMiddleware ||
  adminMiddleware.default;

if (!adminAuth) {
  throw new Error(
    "admin.middleware.js: No admin middleware export found. Export one of: default / adminAuth / verifyAdmin / isAdmin"
  );
}

/**
 * @swagger
 * tags:
 *   name: Admin Seller Activity
 *   description: Admin seller activity analytics APIs
 */

/**
 * @swagger
 * /api/admin/seller-activity/top:
 *   get:
 *     summary: Get top seller activity metrics
 *     tags: [Admin Seller Activity]
 *     security:
 *       - bearerAuth: []
 *       - adminTokenCookie: []
 *     responses:
 *       200:
 *         description: Top seller activity fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/top", adminAuth, getTopSellerActivity);

/**
 * @swagger
 * /api/admin/seller-activity/trend:
 *   get:
 *     summary: Get seller activity trend
 *     tags: [Admin Seller Activity]
 *     security:
 *       - bearerAuth: []
 *       - adminTokenCookie: []
 *     responses:
 *       200:
 *         description: Seller activity trend fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/trend", adminAuth, getSellerTrend);

export default router;
