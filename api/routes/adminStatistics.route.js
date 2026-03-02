
import express from "express";
import {
  getAdminStatistics,
  getSupervisorListings,
  getRevenueAnalytics,
  getCategoryRevenueAnalytics,
  debugOrderItems,
  getSupervisorAnalytics,
} from "../controllers/adminStatistics.controller.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";


const router = express.Router();

router.get("/statistics", verifyAdmin, getAdminStatistics);
router.get("/supervisor-listings", verifyAdmin, getSupervisorListings);
router.get("/revenue", verifyAdmin, getRevenueAnalytics);
router.get("/revenue/categories", verifyAdmin, getCategoryRevenueAnalytics);
router.get("/debug-orderitems", debugOrderItems);
router.get("/supervisor-analytics", getSupervisorAnalytics);

export default router;
