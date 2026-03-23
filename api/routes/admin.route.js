import express from "express";
import {
  getStatistics,
  addSupervisor,
  getSupervisors,
  removeSupervisor,
} from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs
 */

/**
 * @swagger
 * /api/admin/statistics:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *       - adminTokenCookie: []
 *     responses:
 *       200:
 *         description: Admin statistics fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/statistics", verifyAdmin, getStatistics);

/**
 * @swagger
 * /api/admin/add-supervisor:
 *   post:
 *     summary: Add a new supervisor
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *       - adminTokenCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               firstName: John
 *               lastName: Doe
 *               email: john@example.com
 *               phone: "9876543210"
 *               username: john.doe
 *               password: securePassword123
 *               type: phone
 *     responses:
 *       201:
 *         description: Supervisor added successfully
 *       400:
 *         description: Invalid input
 */
router.post("/add-supervisor", verifyAdmin, addSupervisor);

/**
 * @swagger
 * /api/admin/supervisors:
 *   get:
 *     summary: Get all supervisors
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *       - adminTokenCookie: []
 *     responses:
 *       200:
 *         description: List of supervisors
 *       401:
 *         description: Unauthorized
 */
router.get("/supervisors", verifyAdmin, getSupervisors);

/**
 * @swagger
 * /api/admin/supervisors/{userId}:
 *   delete:
 *     summary: Remove a supervisor
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *       - adminTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Supervisor deleted successfully
 *       404:
 *         description: Supervisor not found
 */
router.delete("/supervisors/:userId", verifyAdmin, removeSupervisor);

export default router;
