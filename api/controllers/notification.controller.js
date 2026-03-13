import Notification from "../models/notification.model.js";

// Get notifications
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const notifications = await Notification.find(
      { user_id: userId, archived: false },
      // ✅ Only fetch fields the frontend actually uses
      {
        _id: 1,
        notification_id: 1,
        type: 1,
        title: 1,
        message: 1,
        status: 1,
        read: 1,
        application_type: 1,
        device_data: 1,
        created_at: 1,
        price: 1,
        rejection_reason: 1,
        storage: 1,
        ram: 1
      }
    )
      .sort({ created_at: -1 })
      .lean();

    const unreadCount = notifications.filter(n => !n.read).length;

    res.status(200).json({
      success: true,
      notifications: notifications.map(n => ({
        ...n,
        id: n._id,
        title: n.title,
        message: n.message,

        brand: n.device_data?.brand || "Unknown",
        model: n.device_data?.model || "",
        device_type: n.application_type,
        time: n.created_at
      })),
      unreadCount
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications"
    });
  }
};

// Mark one as read
export const markNotificationRead = async (req, res) => {
  try {
    await Notification.updateOne(
      { _id: req.params.id, user_id: req.user.user_id },
      { $set: { read: true } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read"
    });
  }
};

// Mark all as read
export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user.user_id, read: false }, // ✅ filter to only unread — avoids unnecessary writes
      { $set: { read: true } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read"
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    await Notification.deleteOne({
      _id: req.params.id,
      user_id: req.user.user_id
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification"
    });
  }
};

// Clear all notifications (soft delete via archive)
export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user.user_id, archived: false }, // ✅ filter to only active — avoids unnecessary writes
      { $set: { archived: true } }
    );

    res.status(200).json({
      success: true,
      message: "All notifications cleared"
    });
  } catch (error) {
    console.error("Clear notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear notifications"
    });
  }
};