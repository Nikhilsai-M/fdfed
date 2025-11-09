
import express from "express";
import { getAdminStatistics } from "../controllers/adminStatistics.controller.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";


const router = express.Router();

router.get("/statistics", verifyAdmin, getAdminStatistics);

export default router;
