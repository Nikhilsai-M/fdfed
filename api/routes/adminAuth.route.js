import express from "express";
import { adminSignin, adminSignout } from "../controllers/adminAuth.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin Auth
 *   description: Admin authentication APIs
 */

/**
 * @swagger
 * /api/admin-auth/admin-signin:
 *   post:
 *     summary: Sign in an admin user
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: admin@example.com
 *               password: adminPassword123
 *     responses:
 *       200:
 *         description: Admin signed in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/admin-signin", adminSignin);

/**
 * @swagger
 * /api/admin-auth/admin-signout:
 *   post:
 *     summary: Sign out the current admin
 *     tags: [Admin Auth]
 *     responses:
 *       200:
 *         description: Admin signed out successfully
 */
router.post("/admin-signout", adminSignout);

export default router;
