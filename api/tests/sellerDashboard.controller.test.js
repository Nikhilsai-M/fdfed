import { beforeEach, describe, expect, it, vi } from "vitest";

const orderItemMocks = vi.hoisted(() => ({
  find: vi.fn(),
}));

vi.mock("../models/orderitem.model.js", () => ({
  default: {
    find: orderItemMocks.find,
  },
}));

import {
  getSellerDashboard,
  getSellerDashboardCacheKey,
} from "../controllers/sellerDashboard.controller.js";

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    json(payload) {
      this.body = payload;
      return payload;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
  };
}

describe("sellerDashboard.controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Cache key ────────────────────────────────────────────────────────────

  it("builds a stable cache key for seller dashboards", () => {
    expect(getSellerDashboardCacheKey("seller-42")).toBe("seller-dashboard:seller-42");
  });

  // ─── getSellerDashboard ───────────────────────────────────────────────────

  it("aggregates seller revenue and unique order count", async () => {
    const res = createResponse();
    orderItemMocks.find.mockResolvedValue([
      { order_id: "order-1", amount: "299.50" },
      { order_id: "order-1", amount: 200 },
      { order_id: "order-2", amount: "100.25" },
    ]);

    await getSellerDashboard({ user: { id: "seller-1" } }, res);

    expect(orderItemMocks.find).toHaveBeenCalledWith({ seller_id: "seller-1" });
    expect(res.body).toEqual({
      success: true,
      stats: {
        totalOrders: 2,
        revenue: 599.75,
      },
    });
  });

  it("returns zero totals when the seller has no order items", async () => {
    const res = createResponse();
    orderItemMocks.find.mockResolvedValue([]);

    await getSellerDashboard({ user: { id: "seller-2" } }, res);

    expect(res.body).toEqual({
      success: true,
      stats: { totalOrders: 0, revenue: 0 },
    });
  });

  it("returns a server error response when aggregation fails", async () => {
    const res = createResponse();
    orderItemMocks.find.mockRejectedValue(new Error("db down"));

    await getSellerDashboard({ user: { id: "seller-1" } }, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      success: false,
      message: "Server error",
    });
  });
});
