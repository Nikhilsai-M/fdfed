import { Router } from "express";
import { verifyToken } from "../../middleware/auth.middleware.js";
import {
  createOrderController,
  getPaymentStatusController,
  verifyPaymentController,
} from "./payment.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Razorpay payment APIs
 */

/**
 * @swagger
 * /api/payment/create-order:
 *   post:
 *     summary: Create Razorpay payment order
 *     tags: [Payments]
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
 *               amount: 49999
 *               currency: INR
 *               items:
 *                 - type: phone
 *                   id: "101"
 *                   quantity: 1
 *                   amount: 49999
 *               totalAmount: 49999
 *               paymentMethod: razorpay
 *     responses:
 *       201:
 *         description: Razorpay order created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               paymentId: "65fabc123"
 *               razorpay_order_id: "order_ABC123"   # ✅ changed
 *               amount: 4999900
 *               amountInRupees: 49999
 *               currency: "INR"
 *               dummyMode: false
 *               keyId: "rzp_test_xxxxx"
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Payment order creation failed
 */
router.post("/create-order", verifyToken, createOrderController);

/**
 * @swagger
 * /api/payment/verify-payment:
 *   post:
 *     summary: Verify Razorpay payment and create order
 *     tags: [Payments]
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
 *               razorpay_order_id: "order_ABC123"
 *               razorpay_payment_id: "pay_123ABC"
 *               razorpay_signature: "generated_signature"
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               orderId: "order_101"   # created after verification
 *               duplicate: false
 *               paymentStatus: "success"
 *       400:
 *         description: Invalid signature or verification failed
 *       500:
 *         description: Payment verification failed
 */
router.post("/verify-payment", verifyToken, verifyPaymentController);

/**
 * @swagger
 * /api/payment/status:
 *   get:
 *     summary: Get payment status (recommended)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     parameters:
 *       - in: query
 *         name: razorpayOrderId
 *         schema:
 *           type: string
 *           example: order_ABC123
 *         description: Use Razorpay order ID (recommended)
 *     responses:
 *       200:
 *         description: Payment status fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               payment:
 *                 status: "pending"
 *                 amount: 49999
 *                 razorpay_order_id: "order_ABC123"
 *       404:
 *         description: Payment not found
 */
router.get("/status", verifyToken, getPaymentStatusController);

/**
 * @swagger
 * /api/payment/status/{paymentId}:
 *   get:
 *     summary: Get payment status by internal payment ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Internal payment DB ID (not Razorpay ID)
 *     responses:
 *       200:
 *         description: Payment status fetched successfully
 *       404:
 *         description: Payment not found
 */
router.get("/status/:paymentId", verifyToken, getPaymentStatusController);

export default router;