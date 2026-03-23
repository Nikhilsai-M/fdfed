import { Router } from "express";
import { 
  initiateSellerSignup, 
  verifySellerSignupOTP, 
  resendSellerSignupOTP, 
  sellerLogin, 
  sellerLogout 
} from "../controllers/sellerAuth.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Seller Auth
 *   description: Seller authentication APIs
 */

/**
 * @swagger
 * /api/seller/signup/initiate:
 *   post:
 *     summary: Initiate seller signup with OTP
 *     tags: [Seller Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: Jane Seller
 *               email: seller@example.com
 *               password: securePassword123
 *               phoneNumber: "9876543210"
 *               storeName: Gadget Hub
 *               businessAddress: MG Road, Bengaluru
 */
router.post("/signup/initiate", initiateSellerSignup);

/**
 * @swagger
 * /api/seller/signup/verify:
 *   post:
 *     summary: Verify seller signup OTP
 *     tags: [Seller Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: seller@example.com
 *               otp: "123456"
 */
router.post("/signup/verify", verifySellerSignupOTP);

/**
 * @swagger
 * /api/seller/signup/resend-otp:
 *   post:
 *     summary: Resend seller signup OTP
 *     tags: [Seller Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: seller@example.com
 */
router.post("/signup/resend-otp", resendSellerSignupOTP);

/**
 * @swagger
 * /api/seller/login:
 *   post:
 *     summary: Seller login
 *     tags: [Seller Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: seller@example.com
 *               password: securePassword123
 */
router.post("/login", sellerLogin);

/**
 * @swagger
 * /api/seller/logout:
 *   post:
 *     summary: Seller logout
 *     tags: [Seller Auth]
 *     responses:
 *       200:
 *         description: Seller logged out successfully
 */
router.post("/logout", sellerLogout);

export default router;
