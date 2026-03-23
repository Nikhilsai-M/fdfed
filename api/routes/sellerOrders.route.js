import { Router } from "express";
import { getSellerOrders } from "../controllers/sellerOrder.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Seller Orders
 *   description: Seller order management APIs
 */

/**
 * @swagger
 * /api/seller/orders:
 *   get:
 *     summary: Get orders for the logged-in seller
 *     tags: [Seller Orders]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     responses:
 *       200:
 *         description: Seller orders fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/orders", verifyToken, getSellerOrders);

export default router;
