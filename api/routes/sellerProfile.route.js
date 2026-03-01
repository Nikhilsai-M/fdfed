import { Router } from "express";
import { getSellerProfileAnalytics } from "../controllers/sellerProfile.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = Router();
router.get(
  "/profile-analytics",
  verifyToken,
  getSellerProfileAnalytics
);
export default router;