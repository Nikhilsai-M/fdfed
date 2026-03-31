import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  createOrderController,
  getPaymentStatusController,
  verifyPaymentController,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/create-order", verifyToken, createOrderController);
router.post("/verify-payment", verifyToken, verifyPaymentController);
router.get("/status", verifyToken, getPaymentStatusController);
router.get("/status/:paymentId", verifyToken, getPaymentStatusController);

export default router;
