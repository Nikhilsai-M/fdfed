import express from "express";
import {
  initiateSignup,
  verifySignupOTP,
  resendSignupOTP,
  signin,
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendForgotPasswordOTP,
  signout,
  getUserProfile,
  updateUserProfile,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/signup/initiate:
 *   post:
 *     summary: Initiate signup (send OTP)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Validation error
 */
router.post("/signup/initiate", initiateSignup);

/**
 * @swagger
 * /api/auth/signup/verify:
 *   post:
 *     summary: Verify signup OTP
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid OTP
 */
router.post("/signup/verify", verifySignupOTP);

/**
 * @swagger
 * /api/auth/signup/resend-otp:
 *   post:
 *     summary: Resend signup OTP
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OTP resent
 */
router.post("/signup/resend-otp", resendSignupOTP);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: user@example.com
 *             password: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               token: jwt_token_here
 *               user:
 *                 email: user@example.com
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.post("/signin", signin);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send OTP for password reset
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post("/verify-otp", verifyOTP);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/auth/resend-forgot-password-otp:
 *   post:
 *     summary: Resend forgot password OTP
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OTP resent
 */
router.post("/resend-forgot-password-otp", resendForgotPasswordOTP);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", verifyToken, getUserProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */
router.put("/profile", verifyToken, updateUserProfile);

/**
 * @swagger
 * /api/auth/signout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/signout", signout);

export default router;