import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("GET /api/health", () => {
  it("returns a deployment health snapshot", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.service).toBe("api");
    expect(response.body).toHaveProperty("database.connected");
    expect(response.body).toHaveProperty("redis.ready");
  });

  it("returns JSON content-type", async () => {
    const response = await request(app).get("/api/health");
    expect(response.headers["content-type"]).toContain("application/json");
  });
});
