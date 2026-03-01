
import express from "express";
import {
  getAdminStatistics,
  getSupervisorListings,
  getRevenueAnalytics
} from "../controllers/adminStatistics.controller.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";


const router = express.Router();

router.get("/statistics", verifyAdmin, getAdminStatistics);
router.get("/supervisor-listings", verifyAdmin, getSupervisorListings);
router.get("/revenue", verifyAdmin, getRevenueAnalytics);

export default router;
