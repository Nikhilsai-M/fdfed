import { beforeEach, describe, expect, it, vi } from "vitest";

const redisMocks = vi.hoisted(() => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
}));

vi.mock("../config/redis.js", () => ({
  getCache: redisMocks.getCache,
  setCache: redisMocks.setCache,
}));

import { cacheResponse } from "../middleware/cache.middleware.js";

describe("cache.middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns cached responses immediately on cache hit", async () => {
    redisMocks.getCache.mockResolvedValue({ statusCode: 200, body: { success: true, cached: true } });

    const req = { query: { q: "iphone" } };
    const res = {
      statusCode: 200,
      headers: {},
      set(key, value) { this.headers[key] = value; },
      status(code) { this.statusCode = code; return this; },
      json: vi.fn(),
    };
    const next = vi.fn();

    const middleware = cacheResponse({ keyBuilder: () => "search:iphone", ttlSeconds: 120 });
    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.headers["X-Cache"]).toBe("HIT");
    expect(res.json).toHaveBeenCalledWith({ success: true, cached: true });
  });

  it("stores successful responses on cache miss", async () => {
    redisMocks.getCache.mockResolvedValue(null);
    redisMocks.setCache.mockResolvedValue(true);

    const req = { query: { q: "iphone" } };
    const res = {
      statusCode: 200,
      headers: {},
      set(key, value) { this.headers[key] = value; },
      status(code) { this.statusCode = code; return this; },
      json(body) { this.body = body; return body; },
    };
    const next = vi.fn();

    const middleware = cacheResponse({ keyBuilder: () => "search:iphone", ttlSeconds: 120 });
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    await res.json({ success: true, results: [] });

    expect(res.headers["X-Cache"]).toBe("MISS");
    expect(redisMocks.setCache).toHaveBeenCalledWith(
      "search:iphone",
      { statusCode: 200, body: { success: true, results: [] } },
      120
    );
  });
});
