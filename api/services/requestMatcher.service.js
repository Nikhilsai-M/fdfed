import DeviceRequest from "../models/deviceRequest.model.js";
import Notification from "../models/notification.model.js";
import { v4 as uuidv4 } from "uuid";

export const matchRequests = async (device_type, item) => {
  const requests = await DeviceRequest.find({
   device_type,
  active: true,
  fulfilled: false,
  "criteria.brand": item.brand
  });

  for (const req of requests) {
    const c = req.criteria;

    if (c.model && item.model !== c.model) continue;
    if (c.series && item.series !== c.series) continue;

    await Notification.create({
      notification_id: uuidv4(),
      user_id: req.user_id,
      application_id: item.id.toString(),
      application_type: device_type,
      type: "request_match",
      status: "fulfilled",
      title: "Requested device now available 🎉",
      message: `${item.brand} ${item.model || item.series || ""} is now available`,
      device_data: {
        device_type,
        brand: item.brand,
        model: item.model || item.series || "",
      },
    });

    req.fulfilled = true;
req.active = false;
await req.save();
  }
};

