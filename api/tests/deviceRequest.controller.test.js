import { beforeEach, describe, expect, it, vi } from "vitest";

const deviceRequestMocks = vi.hoisted(() => ({
  create: vi.fn(),
  findById: vi.fn(),
}));

const notificationMocks = vi.hoisted(() => ({
  create: vi.fn(),
}));

vi.mock("../models/deviceRequest.model.js", () => ({
  default: {
    create: deviceRequestMocks.create,
    findById: deviceRequestMocks.findById,
  },
}));

vi.mock("../models/notification.model.js", () => ({
  default: {
    create: notificationMocks.create,
  },
}));

vi.mock("uuid", () => ({
  v4: vi.fn(() => "uuid-123"),
}));

import {
  createDeviceRequest,
  updateDeviceRequestStatus,
} from "../controllers/deviceRequest.controller.js";

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return payload;
    },
  };
}

describe("deviceRequest.controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── createDeviceRequest ──────────────────────────────────────────────────

  it("rejects requests without device type or brand", async () => {
    const next = vi.fn();

    await createDeviceRequest(
      {
        body: { device_type: "", criteria: {} },
        user: { user_id: "user-1" },
      },
      createResponse(),
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Device type and brand are required",
      })
    );
    expect(deviceRequestMocks.create).not.toHaveBeenCalled();
  });

  it("creates a device request and pending notification for the customer", async () => {
    const res = createResponse();
    const next = vi.fn();
    const requestRecord = {
      _id: { toString: () => "mongo-request-id" },
      user_id: "user-1",
      device_type: "phone",
      criteria: { brand: "Apple", model: "iPhone 14" },
    };

    deviceRequestMocks.create.mockResolvedValue(requestRecord);

    await createDeviceRequest(
      {
        body: {
          device_type: "phone",
          criteria: { brand: "Apple", model: "iPhone 14" },
        },
        user: { user_id: "user-1" },
      },
      res,
      next
    );

    expect(deviceRequestMocks.create).toHaveBeenCalledWith({
      user_id: "user-1",
      device_type: "phone",
      criteria: { brand: "Apple", model: "iPhone 14" },
    });
    expect(notificationMocks.create).toHaveBeenCalledWith(
      expect.objectContaining({
        notification_id: "uuid-123",
        user_id: "user-1",
        application_id: "mongo-request-id",
        application_type: "phone",
        type: "request_update",
        status: "pending",
        title: "Device Request Created",
      })
    );
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      success: true,
      request: requestRecord,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("passes database errors from createDeviceRequest to next middleware", async () => {
    const next = vi.fn();
    deviceRequestMocks.create.mockRejectedValue(new Error("DB connection failed"));

    await createDeviceRequest(
      {
        body: { device_type: "phone", criteria: { brand: "Apple" } },
        user: { user_id: "user-2" },
      },
      createResponse(),
      next
    );

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  // ─── updateDeviceRequestStatus ────────────────────────────────────────────

  it("returns not found when trying to update a missing request", async () => {
    const next = vi.fn();
    deviceRequestMocks.findById.mockResolvedValue(null);

    await updateDeviceRequestStatus(
      {
        params: { id: "missing-id" },
        body: { status: "approved" },
      },
      createResponse(),
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "Request not found",
      })
    );
    expect(notificationMocks.create).not.toHaveBeenCalled();
  });

  it("updates request status and sends a completion notification", async () => {
    const res = createResponse();
    const next = vi.fn();
    const save = vi.fn();
    const requestRecord = {
      _id: { toString: () => "request-1" },
      user_id: "user-7",
      device_type: "laptop",
      criteria: { brand: "Dell", model: "XPS 13" },
      status: "pending",
      save,
    };

    deviceRequestMocks.findById.mockResolvedValue(requestRecord);

    await updateDeviceRequestStatus(
      {
        params: { id: "request-1" },
        body: { status: "approved" },
      },
      res,
      next
    );

    expect(requestRecord.status).toBe("approved");
    expect(save).toHaveBeenCalled();
    expect(notificationMocks.create).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-7",
        application_type: "laptop",
        status: "approved",
        title: "Device Request Approved",
        message: "Dell XPS 13 request approved",
      })
    );
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(next).not.toHaveBeenCalled();
  });
});
