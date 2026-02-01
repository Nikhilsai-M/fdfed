import DeviceRequest from "../models/deviceRequest.model.js";
import Notification from "../models/notification.model.js";
import { errorHandler } from "../utils/error.js";
import { v4 as uuidv4 } from "uuid";

export const createDeviceRequest = async (req, res, next) => {
  try {
    const { device_type, criteria } = req.body;

    if (!device_type || !criteria?.brand) {
      return next(errorHandler(400, "Device type and brand are required"));
    }

    const request = await DeviceRequest.create({
      user_id: req.user.user_id,
      device_type,
      criteria,
    });

    // 🔔 CREATE REQUEST NOTIFICATION
    await Notification.create({
      notification_id: uuidv4(),
      user_id: req.user.user_id,
      application_id: request._id.toString(),
      application_type: device_type,
      type: "request_update",

      title: "Device Request Created",
      message: `We’ll notify you when ${criteria.brand} ${
        criteria.model || ""
      } is available`,

      status: "pending",

      device_data: {
        brand: criteria.brand,
        model: criteria.model || "",
      },
    });

    res.status(201).json({
      success: true,
      request,
    });
  } catch (err) {
    console.error("Create device request failed:", err);
    next(errorHandler(500, err.message));
  }
};
export const updateDeviceRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const request = await DeviceRequest.findById(id);
    if (!request) return next(errorHandler(404, "Request not found"));

    request.status = status;
    await request.save();

    await Notification.create({
      notification_id: uuidv4(),
      user_id: request.user_id,
      application_id: request._id.toString(),
      application_type: request.device_type,
      type: "request_update",
      status,
      title:
        status === "approved"
          ? "Device Request Approved"
          : "Device Request Rejected",
      message:
        status === "approved"
          ? `${request.criteria.brand} ${request.criteria.model || ""} request approved`
          : rejectionReason || "Your device request was rejected",
      device_data: {
        device_type: request.device_type,
        brand: request.criteria.brand,
        model: request.criteria.model || "",
      },
    });

    res.status(200).json({ success: true });
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};
