import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Logged-in user profile APIs
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get the logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", verifyToken, getUserProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update the logged-in user profile
 *     tags: [Users]
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
 *               username: johndoe
 *               email: john@example.com
 *               phone: "9876543210"
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/profile", verifyToken, updateUserProfile);

export default router;
