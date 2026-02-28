import express from "express";
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/notification.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", verifyToken, getUserNotifications);
router.put("/read-all", verifyToken, markAllNotificationsRead); // ✅ must be BEFORE /:id
router.put("/:id/read", verifyToken, markNotificationRead);
router.delete("/clear-all", verifyToken, clearAllNotifications); // ✅ must be BEFORE /:id
router.delete("/:id", verifyToken, deleteNotification);

export default router;