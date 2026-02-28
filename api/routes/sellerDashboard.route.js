import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getSellerDashboard } from "../controllers/sellerDashboard.controller.js";

const router = express.Router();

router.get("/dashboard", verifyToken, getSellerDashboard);

export default router;