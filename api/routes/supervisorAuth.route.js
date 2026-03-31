import express from "express";
import { supervisorSignin, checkSupervisorExists } from "../controllers/supervisorAuth.controller.js";

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
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Supervisor username or email
 *               password:
 *                 type: string
 *             example:
 *               username: supervisor@se.com
 *               password: Supervisor@123
 *     responses:
 *       200:
 *         description: Supervisor signed in successfully
 *       400:
 *         description: Missing or invalid credentials
 */
router.post("/signin", supervisorSignin);

/**
 * @swagger
 * /api/supervisor-auth/check:
 *   get:
 *     summary: Check if a supervisor exists
 *     tags: [Supervisor Auth]
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Supervisor username or email to check
 *     responses:
 *       200:
 *         description: Supervisor existence checked successfully
 */
router.get("/check", checkSupervisorExists);

export default router;
