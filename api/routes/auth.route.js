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
import { verifyToken } from "../utils/verifyUser.js";

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - password
 *               - address
 *             properties:
 *               username:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postal_code:
 *                     type: string
 *                   country:
 *                     type: string
 *             example:
 *               username: johndoe
 *               firstName: John
 *               lastName: Doe
 *               email: john@example.com
 *               phone: "9876543210"
 *               password: securePassword123
 *               address:
 *                 street: 12 MG Road
 *                 city: Bengaluru
 *                 state: Karnataka
 *                 postal_code: "560001"
 *                 country: India
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *             example:
 *               email: john@example.com
 *               otp: "123456"
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: john@example.com
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
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             username: johndoe
 *             password: password123
 *     responses:
 *       200:
 *         description: Login successful
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usernameOrEmail
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *             example:
 *               usernameOrEmail: johndoe
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *             example:
 *               email: john@example.com
 *               otp: "123456"
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               email: john@example.com
 *               otp: "123456"
 *               newPassword: newSecurePassword123
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: john@example.com
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
 *       - accessTokenCookie: []
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
 *       - accessTokenCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postal_code:
 *                     type: string
 *                   country:
 *                     type: string
 *             example:
 *               firstName: John
 *               lastName: Doe
 *               phone: "9876543210"
 *               address:
 *                 city: Bengaluru
 *                 state: Karnataka
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
