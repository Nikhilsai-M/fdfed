
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

// User Auth Routes
router.post("/signup/initiate", initiateSignup);
router.post("/signup/verify", verifySignupOTP);
router.post("/signup/resend-otp", resendSignupOTP);
router.post("/signin", signin);

// Forgot Password Flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.post("/resend-forgot-password-otp", resendForgotPasswordOTP); // Add this

// Profile Routes
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.post("/signout", signout);

export default router;
