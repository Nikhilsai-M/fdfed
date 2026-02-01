import express from "express";
import {
  createDeviceRequest,
  updateDeviceRequestStatus,
} from "../controllers/deviceRequest.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createDeviceRequest);

// 🔥 THIS IS THE KEY ROUTE
router.put("/:id/status", updateDeviceRequestStatus);

export default router;
