
import express from "express";
import { getAdminStatistics, getSupervisorListings } from "../controllers/adminStatistics.controller.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";


const router = express.Router();

router.get("/statistics", verifyAdmin, getAdminStatistics);
router.get("/supervisor-listings", verifyAdmin, getSupervisorListings);

export default router;
