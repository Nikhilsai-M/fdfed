import express from "express";
import {
  signup,
  signin,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

// User Auth Routes
router.post("/signup", signup);
router.post("/signin", signin);

// Forgot Password Flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
