import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  notification_id: {
    type: String,
    required: true,
    unique: true
  },

  user_id: {
    type: String,
    required: true
  },

  application_id: String,
  application_type: String, // phone | laptop

  type: {
    type: String,
    enum: [
      "listing_update",
      "request_update",
      "request_fulfilled"
    ],
    required: true
  },

  title: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "fulfilled"],
    required: true
  },

  read: {
    type: Boolean,
    default: false
  },

  archived: {
    type: Boolean,
    default: false
  },

  device_data: {
    brand: String,
    model: String
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
