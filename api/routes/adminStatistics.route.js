import express from "express";
import {
  getAdminStatisticsCacheKey,
  getAdminStatistics,
  getSupervisorListings,
  getRevenueAnalytics,
  getCategoryRevenueAnalytics,
  debugOrderItems,
  getSupervisorAnalytics,
  getTopSupervisors,
  getSupervisorActivityById,
} from "../controllers/adminStatistics.controller.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import { cacheResponse } from "../middleware/cache.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin Statistics
 *   description: Admin reporting and analytics APIs
 */

/**
 * @swagger
 * /api/admin/statistics:
 *   get:
 *     summary: Get admin statistics overview
 *     tags: [Admin Statistics]
 *     security:
 *       - bearerAuth: []
 *       - adminTokenCookie: []
 *     responses:
 *       200:
 *         description: Admin statistics fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/statistics",
  verifyAdmin,
  cacheResponse({
    keyBuilder: (req) => getAdminStatisticsCacheKey(req.query.range || "7"),
    ttlSeconds: parseInt(process.env.ANALYTICS_CACHE_TTL_SECONDS || "180", 10),
  }),
  getAdminStatistics
);

/**
 * @swagger
 * /api/admin/supervisor-listings:
 *   get:
 *     summary: Get supervisor listings overview
 *     tags: [Admin Statistics]
 *     security:
 *       - bearerAuth: []
 *       - adminTokenCookie: []
 *     responses:
 *       200:
 *         description: Supervisor listings fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/supervisor-listings", verifyAdmin, getSupervisorListings);

/**
 * @swagger
 * /api/admin/revenue:
 *   get:
 *     summary: Get revenue analytics
 *     tags: [Admin Statistics]
 *     security:
 *       - bearerAuth: []
 *       - adminTokenCookie: []
 *     responses:
 *       200:
 *         description: Revenue analytics fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/revenue", verifyAdmin, getRevenueAnalytics);

/**
 * @swagger
 * /api/admin/revenue/categories:
 *   get:
 *     summary: Get category revenue analytics
 *     tags: [Admin Statistics]
 *     security:
 *       - bearerAuth: []
 *       - adminTokenCookie: []
 *     responses:
 *       200:
 *         description: Category revenue analytics fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/revenue/categories", verifyAdmin, getCategoryRevenueAnalytics);

/**
 * @swagger
 * /api/admin/debug-orderitems:
 *   get:
 *     summary: Debug order items
 *     tags: [Admin Statistics]
 *     responses:
 *       200:
 *         description: Order item debug data fetched successfully
 */
router.get("/debug-orderitems", debugOrderItems);

/**
 * @swagger
 * /api/admin/supervisor-analytics:
 *   get:
 *     summary: Get supervisor analytics
 *     tags: [Admin Statistics]
 *     responses:
 *       200:
 *         description: Supervisor analytics fetched successfully
 */
router.get("/supervisor-analytics", getSupervisorAnalytics);

/**
 * @swagger
 * /api/admin/top-supervisors:
 *   get:
 *     summary: Get top supervisors
 *     tags: [Admin Statistics]
 *     responses:
 *       200:
 *         description: Top supervisors fetched successfully
 */
router.get("/top-supervisors", getTopSupervisors);

/**
 * @swagger
 * /api/admin/supervisor-activity/{supervisorId}:
 *   get:
 *     summary: Get activity for a supervisor
 *     tags: [Admin Statistics]
 *     parameters:
 *       - in: path
 *         name: supervisorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Supervisor activity fetched successfully
 *       404:
 *         description: Supervisor not found
 */
router.get("/supervisor-activity/:supervisorId", getSupervisorActivityById);

export default router;
