import { Router } from "express";
import { getSellerProfileAnalytics } from "../controllers/sellerProfile.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Seller Profile
 *   description: Seller profile analytics APIs
 */

/**
 * @swagger
 * /api/seller/profile-analytics:
 *   get:
 *     summary: Get seller profile analytics
 *     tags: [Seller Profile]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     responses:
 *       200:
 *         description: Seller profile analytics fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/profile-analytics",
  verifyToken,
  getSellerProfileAnalytics
);

export default router;
