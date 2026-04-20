import { beforeEach, describe, expect, it, vi } from "vitest";

const deviceRequestMocks = vi.hoisted(() => ({
  find: vi.fn(),
}));

const notificationMocks = vi.hoisted(() => ({
  create: vi.fn(),
}));

vi.mock("../models/deviceRequest.model.js", () => ({
  default: {
    find: deviceRequestMocks.find,
  },
}));

vi.mock("../models/notification.model.js", () => ({
  default: {
    create: notificationMocks.create,
  },
}));

vi.mock("uuid", () => ({
  v4: vi.fn(() => "uuid-456"),
}));

import { matchRequests } from "../services/requestMatcher.service.js";

describe("requestMatcher.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Laptop matching ──────────────────────────────────────────────────────

  it("marks laptop requests fulfilled and notifies the customer with the laptop series", async () => {
    const save = vi.fn();
    const matchingRequest = {
      user_id: "user-22",
      criteria: { brand: "Dell", model: "XPS 13" },
      fulfilled: false,
      active: true,
      save,
    };

    deviceRequestMocks.find.mockResolvedValue([matchingRequest]);

    await matchRequests("laptop", {
      id: 701,
      brand: "Dell",
      series: "XPS 13",
    });

    expect(deviceRequestMocks.find).toHaveBeenCalledWith({
      device_type: "laptop",
      active: true,
      fulfilled: false,
      "criteria.brand": { $regex: "^Dell$", $options: "i" },
    });
    expect(notificationMocks.create).toHaveBeenCalledWith(
      expect.objectContaining({
        notification_id: "uuid-456",
        user_id: "user-22",
        application_id: "701",
        application_type: "laptop",
        status: "fulfilled",
        message: "Dell XPS 13 is now available",
        device_data: {
          brand: "Dell",
          model: "XPS 13",
        },
      })
    );
    expect(matchingRequest.fulfilled).toBe(true);
    expect(matchingRequest.active).toBe(false);
    expect(save).toHaveBeenCalled();
  });

  it("skips notification creation when there are no matching requests", async () => {
    deviceRequestMocks.find.mockResolvedValue([]);

    await matchRequests("phone", {
      id: 101,
      brand: "Apple",
      model: "iPhone 14",
    });

    expect(notificationMocks.create).not.toHaveBeenCalled();
  });

  it("uses item.model (not item.series) for phone device notifications", async () => {
    const save = vi.fn();
    deviceRequestMocks.find.mockResolvedValue([
      { user_id: "u1", criteria: { brand: "Samsung" }, fulfilled: false, active: true, save },
    ]);

    await matchRequests("phone", { id: 200, brand: "Samsung", model: "Galaxy S24" });

    expect(notificationMocks.create).toHaveBeenCalledWith(
      expect.objectContaining({
        application_type: "phone",
        message: "Samsung Galaxy S24 is now available",
      })
    );
  });

  it("processes multiple matching requests and notifies all users", async () => {
    const save1 = vi.fn();
    const save2 = vi.fn();
    deviceRequestMocks.find.mockResolvedValue([
      { user_id: "u1", criteria: { brand: "Apple" }, fulfilled: false, active: true, save: save1 },
      { user_id: "u2", criteria: { brand: "Apple" }, fulfilled: false, active: true, save: save2 },
    ]);

    await matchRequests("phone", { id: 300, brand: "Apple", model: "iPhone 16" });

    expect(notificationMocks.create).toHaveBeenCalledTimes(2);
    expect(save1).toHaveBeenCalled();
    expect(save2).toHaveBeenCalled();
  });
});
