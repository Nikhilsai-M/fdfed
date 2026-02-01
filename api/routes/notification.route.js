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

router.get("/",verifyToken, getUserNotifications);
router.put("/:id/read",verifyToken, markNotificationRead);
router.put("/read-all",verifyToken, markAllNotificationsRead);
router.delete("/:id",verifyToken, deleteNotification);
router.delete("/clear-all",verifyToken, clearAllNotifications);

export default router;
