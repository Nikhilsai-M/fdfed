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
});
