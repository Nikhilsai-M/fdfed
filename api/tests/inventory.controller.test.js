import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../app.js";

vi.mock("../crud/inventory.js", () => ({
  getAllPhones: vi.fn().mockResolvedValue([]),
  getAllLaptops: vi.fn().mockResolvedValue([]),
  getAllEarphones: vi.fn().mockResolvedValue([]),
  getAllChargers: vi.fn().mockResolvedValue([]),
  getAllMouses: vi.fn().mockResolvedValue([]),
  getAllSmartwatches: vi.fn().mockResolvedValue([]),
}));

it("should handle inventory request", async () => {
  const res = await request(app).get("/api/supervisor/inventory");

  expect([200, 401]).toContain(res.statusCode);

  if (res.statusCode === 200) {
    expect(res.body).toHaveProperty("items");
  }
});

it("should not return a 5xx error for inventory request", async () => {
  const res = await request(app).get("/api/supervisor/inventory");
  expect(res.statusCode).toBeLessThan(500);
});
