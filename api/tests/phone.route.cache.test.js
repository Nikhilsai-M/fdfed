import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const phoneCrudMocks = vi.hoisted(() => ({
  getAllPhones: vi.fn(),
  getPhoneById: vi.fn(),
  getLatestPhones: vi.fn(),
}));

const redisMocks = vi.hoisted(() => ({
  connectRedis: vi.fn(),
  deleteCacheByPattern: vi.fn(),
  disconnectRedis: vi.fn(),
  getCache: vi.fn(),
  getRedisHealth: vi.fn(),
  invalidateCatalogCaches: vi.fn(),
  isRedisEnabled: vi.fn(),
  isRedisReady: vi.fn(),
  setCache: vi.fn(),
  withCachePrefix: vi.fn((key) => key),
}));

vi.mock("../crud/phones.js", () => ({
  getAllPhones: phoneCrudMocks.getAllPhones,
  getPhoneById: phoneCrudMocks.getPhoneById,
  getLatestPhones: phoneCrudMocks.getLatestPhones,
  initPhones: vi.fn(),
}));

vi.mock("../config/redis.js", () => ({
  connectRedis: redisMocks.connectRedis,
  deleteCacheByPattern: redisMocks.deleteCacheByPattern,
  disconnectRedis: redisMocks.disconnectRedis,
  getCache: redisMocks.getCache,
  getRedisHealth: redisMocks.getRedisHealth,
  invalidateCatalogCaches: redisMocks.invalidateCatalogCaches,
  isRedisEnabled: redisMocks.isRedisEnabled,
  isRedisReady: redisMocks.isRedisReady,
  setCache: redisMocks.setCache,
  withCachePrefix: redisMocks.withCachePrefix,
}));

import app from "../app.js";

describe("phone.route caching", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    redisMocks.getRedisHealth.mockResolvedValue({
      enabled: true,
      ready: true,
      url: "redis://127.0.0.1:6379",
    });
  });

  it("caches the full phone catalog on cache miss", async () => {
    phoneCrudMocks.getAllPhones.mockResolvedValue([
      { id: 1, brand: "Apple", model: "iPhone 14" },
    ]);
    redisMocks.getCache.mockResolvedValue(null);
    redisMocks.setCache.mockResolvedValue(true);

    const response = await request(app).get("/api/phones");

    expect(response.status).toBe(200);
    expect(response.headers["x-cache"]).toBe("MISS");
    expect(response.body).toEqual([{ id: 1, brand: "Apple", model: "iPhone 14" }]);
    expect(phoneCrudMocks.getAllPhones).toHaveBeenCalledTimes(1);
    expect(redisMocks.setCache).toHaveBeenCalledWith(
      "inventory:phones:all",
      {
        statusCode: 200,
        body: [{ id: 1, brand: "Apple", model: "iPhone 14" }],
      },
      120
    );
  });

  it("serves the full phone catalog from cache on cache hit", async () => {
    redisMocks.getCache.mockResolvedValue({
      statusCode: 200,
      body: [{ id: 2, brand: "Samsung", model: "S24" }],
    });

    const response = await request(app).get("/api/phones");

    expect(response.status).toBe(200);
    expect(response.headers["x-cache"]).toBe("HIT");
    expect(response.body).toEqual([{ id: 2, brand: "Samsung", model: "S24" }]);
    expect(phoneCrudMocks.getAllPhones).not.toHaveBeenCalled();
    expect(redisMocks.setCache).not.toHaveBeenCalled();
  });
});
