import express from "express";
import { 
    getCustomerProfile, 
    updateCustomerProfile, 
    updateCustomerPassword, 
    getCustomerListings,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getNotificationsDummy,  // If you want to use dummy data
    clearAllNotifications   // Add this
} from "../controllers/customer.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/profile", verifyToken, getCustomerProfile);
router.put("/profile", verifyToken, updateCustomerProfile);
router.post("/password", verifyToken, updateCustomerPassword);
router.get("/listings", verifyToken, getCustomerListings);

// Notification routes - use getNotifications for real data or getNotificationsDummy for testing
router.get("/notifications", verifyToken, getNotifications); // Use getNotificationsDummy for testing
router.put("/notifications/:id/read", verifyToken, markNotificationAsRead);
router.put("/notifications/read-all", verifyToken, markAllNotificationsAsRead);
router.delete("/notifications/:id", verifyToken, deleteNotification);
router.delete("/notifications/clear-all", verifyToken, clearAllNotifications); // Add this route

export default router;
