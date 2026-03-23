import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getSellerDashboard } from "../controllers/sellerDashboard.controller.js";

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
router.get("/dashboard", verifyToken, getSellerDashboard);

export default router;
