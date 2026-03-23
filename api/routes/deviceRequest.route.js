import express from "express";
import {
  createDeviceRequest,
  updateDeviceRequestStatus,
} from "../controllers/deviceRequest.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Device Requests
 *   description: Device request APIs
 */

/**
 * @swagger
 * /api/device-requests:
 *   post:
 *     summary: Create a device request
 *     tags: [Device Requests]
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
 *               device_type: phone
 *               criteria:
 *                 brand: Apple
 *                 model: iPhone 14
 *     responses:
 *       201:
 *         description: Device request created successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/", verifyToken, createDeviceRequest);

/**
 * @swagger
 * /api/device-requests/{id}/status:
 *   put:
 *     summary: Update device request status
 *     tags: [Device Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               status: approved
 *               rejectionReason: Out of stock
 *     responses:
 *       200:
 *         description: Device request status updated successfully
 *       404:
 *         description: Request not found
 */
router.put("/:id/status", updateDeviceRequestStatus);

export default router;
