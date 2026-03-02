import { Router } from "express";
import { 
  initiateSellerSignup, 
  verifySellerSignupOTP, 
  resendSellerSignupOTP, 
  sellerLogin, 
  sellerLogout 
} from "../controllers/sellerAuth.controller.js";

const router = Router();

// 🟢 NEW: OTP-based Signup Flow
router.post("/signup/initiate", initiateSellerSignup);
router.post("/signup/verify", verifySellerSignupOTP);
router.post("/signup/resend-otp", resendSellerSignupOTP);

// 🟢 EXISTING: Login and Logout
router.post("/login", sellerLogin);
router.post("/logout", sellerLogout);

export default router;