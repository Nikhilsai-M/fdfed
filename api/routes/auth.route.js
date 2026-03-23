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

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and account APIs
 */

/**
 * @swagger
 * /api/auth/signup/initiate:
 *   post:
 *     summary: Initiate user signup with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               username: johndoe
 *               email: john@example.com
 *               password: securePassword123
 *     responses:
 *       200:
 *         description: Signup OTP sent successfully
 *       400:
 *         description: Invalid signup data
 */
router.post("/signup/initiate", initiateSignup);

/**
 * @swagger
 * /api/auth/signup/verify:
 *   post:
 *     summary: Verify signup OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: john@example.com
 *               otp: "123456"
 *     responses:
 *       200:
 *         description: Signup verified successfully
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: john@example.com
 *     responses:
 *       200:
 *         description: Signup OTP resent successfully
 */
router.post("/signup/resend-otp", resendSignupOTP);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: john@example.com
 *               password: securePassword123
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/signin", signin);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Initiate forgot-password flow
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: john@example.com
 *     responses:
 *       200:
 *         description: Forgot-password OTP sent successfully
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify forgot-password OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: john@example.com
 *               otp: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post("/verify-otp", verifyOTP);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: john@example.com
 *               otp: "123456"
 *               newPassword: newSecurePassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid reset request
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/auth/resend-forgot-password-otp:
 *   post:
 *     summary: Resend forgot-password OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: john@example.com
 *     responses:
 *       200:
 *         description: Forgot-password OTP resent successfully
 */
router.post("/resend-forgot-password-otp", resendForgotPasswordOTP);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile from auth module
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 */
router.get("/profile", getUserProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile from auth module
 *     tags: [Auth]
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
 */
router.put("/profile", updateUserProfile);

/**
 * @swagger
 * /api/auth/signout:
 *   post:
 *     summary: Sign out the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User signed out successfully
 */
router.post("/signout", signout);

export default router;
