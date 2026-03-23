import express from "express";
import { supervisorSignin, checkSupervisorExists } from "../controllers/supervisorAuth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Supervisor Auth
 *   description: Supervisor authentication APIs
 */

/**
 * @swagger
 * /api/supervisor-auth/signin:
 *   post:
 *     summary: Sign in a supervisor
 *     tags: [Supervisor Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: supervisor@example.com
 *               password: securePassword123
 */
router.post("/signin", supervisorSignin);

/**
 * @swagger
 * /api/supervisor-auth/check:
 *   get:
 *     summary: Check if a supervisor exists
 *     tags: [Supervisor Auth]
 *     responses:
 *       200:
 *         description: Supervisor existence checked successfully
 */
router.get("/check", checkSupervisorExists);
// router.get("/profile", verifyToken, getS);

export default router;
