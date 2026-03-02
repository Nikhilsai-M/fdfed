import express from "express";
import {
  getTopSellerActivity,
  getSellerTrend,
} from "../controllers/adminSellerActivity.controller.js";

// ✅ Import the whole module, then pick the exported middleware safely
import * as adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

// ✅ pick whichever export exists in your file
const adminAuth =
  adminMiddleware.adminAuth ||
  adminMiddleware.adminauth ||
  adminMiddleware.isAdmin ||
  adminMiddleware.verifyAdmin ||
  adminMiddleware.adminMiddleware ||
  adminMiddleware.default;

if (!adminAuth) {
  throw new Error(
    "admin.middleware.js: No admin middleware export found. Export one of: default / adminAuth / verifyAdmin / isAdmin"
  );
}

router.get("/top", adminAuth, getTopSellerActivity);
router.get("/trend", adminAuth, getSellerTrend);

export default router;