import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("GET /search", () => {
  it("supports the search alias endpoint", async () => {
    const response = await request(app).get("/search?q=");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.engine).toBe("none");
    expect(response.body.results).toEqual([]);
  });
});
