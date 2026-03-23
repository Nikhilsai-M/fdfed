import express from "express";
import {
  getCustomerProfile,
  updateCustomerProfile,
  updateCustomerPassword,
  getCustomerListings,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationsDummy,
  clearAllNotifications,
} from "../controllers/customer.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer profile and account APIs
 */

/**
 * @swagger
 * /api/customer/profile:
 *   get:
 *     summary: Get the logged-in customer profile
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     responses:
 *       200:
 *         description: Customer profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", verifyToken, getCustomerProfile);

/**
 * @swagger
 * /api/customer/profile:
 *   put:
 *     summary: Update the logged-in customer profile
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               fullName: John Doe
 *               email: john@example.com
 *               phone: "9876543210"
 *     responses:
 *       200:
 *         description: Customer profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/profile", verifyToken, updateCustomerProfile);

/**
 * @swagger
 * /api/customer/password:
 *   post:
 *     summary: Update the logged-in customer password
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               currentPassword: oldPassword123
 *               newPassword: newPassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/password", verifyToken, updateCustomerPassword);

/**
 * @swagger
 * /api/customer/listings:
 *   get:
 *     summary: Get listings created by the logged-in customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     responses:
 *       200:
 *         description: Customer listings fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/listings", verifyToken, getCustomerListings);

router.get("/notifications", verifyToken, getNotifications);
router.put("/notifications/:id/read", verifyToken, markNotificationAsRead);
router.put("/notifications/read-all", verifyToken, markAllNotificationsAsRead);
router.delete("/notifications/:id", verifyToken, deleteNotification);
router.delete("/notifications/clear-all", verifyToken, clearAllNotifications);

export default router;
