import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  getSellerDashboard,
  getSellerDashboardCacheKey,
} from "../controllers/sellerDashboard.controller.js";
import { cacheResponse } from "../middleware/cache.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Seller Dashboard
 *   description: Seller dashboard APIs
 */

/**
 * @swagger
 * /api/seller/dashboard:
 *   get:
 *     summary: Get seller dashboard data
 *     tags: [Seller Dashboard]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     responses:
 *       200:
 *         description: Seller dashboard fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/dashboard",
  verifyToken,
  cacheResponse({
    keyBuilder: (req) => getSellerDashboardCacheKey(req.user.id),
    ttlSeconds: parseInt(process.env.SELLER_DASHBOARD_CACHE_TTL_SECONDS || "180", 10),
  }),
  getSellerDashboard
);

export default router;
