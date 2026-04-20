import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../app.js";

// mock mongoose chain
function mockQuery() {
  return {
    sort: () => ({
      limit: () => ({
        lean: () => Promise.resolve([]),
      }),
    }),
  };
}

// mock models
vi.mock("../models/phone.model.js", () => ({
  default: { find: vi.fn(() => mockQuery()) },
}));
vi.mock("../models/laptop.model.js", () => ({
  default: { find: vi.fn(() => mockQuery()) },
}));
vi.mock("../models/earphone.model.js", () => ({
  default: { find: vi.fn(() => mockQuery()) },
}));
vi.mock("../models/charger.model.js", () => ({
  default: { find: vi.fn(() => mockQuery()) },
}));
vi.mock("../models/mouse.model.js", () => ({
  default: { find: vi.fn(() => mockQuery()) },
}));
vi.mock("../models/smartwatch.model.js", () => ({
  default: { find: vi.fn(() => mockQuery()) },
}));

// mock redis
vi.mock("../config/redis.js", () => ({
  getCache: vi.fn().mockResolvedValue(null),
  setCache: vi.fn().mockResolvedValue(true),
  isRedisReady: vi.fn().mockReturnValue(false),
}));

describe("GET /search", () => {
  it("returns empty results for empty query", async () => {
    const res = await request(app).get("/search?q=");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.results).toEqual([]);
  });

  it("returns results structure for valid query", async () => {
    const res = await request(app).get("/search?q=phone");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("results");
    expect(res.body).toHaveProperty("count");
    expect(res.body).toHaveProperty("query");
  });

  it("handles uppercase query parameter gracefully", async () => {
    const res = await request(app).get("/search?q=PHONE");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
