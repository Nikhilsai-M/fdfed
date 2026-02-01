import DeviceRequest from "../models/deviceRequest.model.js";
import Notification from "../models/notification.model.js";
import { v4 as uuidv4 } from "uuid";

export const matchRequests = async (device_type, item) => {
  console.log("🔔 matchRequests called");
  console.log("➡️ device_type:", device_type);
  console.log("➡️ item.brand:", item.brand);
  console.log("➡️ item.model:", item.model);

  const requests = await DeviceRequest.find({
    device_type,
    active: true,
    fulfilled: false,
    "criteria.brand": { $regex: `^${item.brand}$`, $options: "i" }
  });

  console.log("📦 matching requests found:", requests.length);

  if (requests.length === 0) {
    console.warn("⚠️ No matching device requests found");
  }

  for (const req of requests) {
    console.log("✅ Matching request for user:", req.user_id);
    console.log("➡️ Request criteria:", req.criteria);

    try {
      await Notification.create({
        notification_id: uuidv4(),
        user_id: req.user_id,
        application_id: item.id.toString(),
        application_type: device_type,
        type: "request_fulfilled", // ✅ FIXED
        status: "fulfilled",
        title: "Requested device now available 🎉",
        message: `${item.brand} ${item.model || ""} is now available`,
        device_data: {
          brand: item.brand,
          model: item.model || "",
        },
      });

      console.log("📨 Notification created for user:", req.user_id);

      req.fulfilled = true;
      req.active = false;
      await req.save();

      console.log("✔️ Request marked fulfilled");
    } catch (err) {
      console.error("❌ Notification creation failed:", err.message);
    }
  }
};
