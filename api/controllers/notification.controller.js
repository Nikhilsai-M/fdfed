import Notification from "../models/notification.model.js";

// Get notifications
export const getUserNotifications = async (req, res) => {
  const userId = req.user.user_id;

  const notifications = await Notification.find({
    user_id: userId,
    archived: false
  })
    .sort({ created_at: -1 })
    .lean();

  const unreadCount = notifications.filter(n => !n.read).length;

  res.status(200).json({
    success: true,
    notifications: notifications.map(n => ({
      ...n,
      id: n._id,
      brand: n.device_data?.brand || "Unknown",
      model: n.device_data?.model || "",
      device_type: n.application_type,
      time: n.created_at
    })),
    unreadCount
  });
};

// Mark one as read
export const markNotificationRead = async (req, res) => {
  await Notification.updateOne(
    { _id: req.params.id, user_id: req.user.user_id },
    { $set: { read: true } }
  );

  res.json({ success: true });
};

// Mark all as read
export const markAllNotificationsRead = async (req, res) => {
  await Notification.updateMany(
    { user_id: req.user.user_id },
    { $set: { read: true } }
  );

  res.json({ success: true });
};

// Delete notification
export const deleteNotification = async (req, res) => {
  await Notification.deleteOne({
    _id: req.params.id,
    user_id: req.user.user_id
  });

  res.json({ success: true });
};

export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user.user_id },
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
