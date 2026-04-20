import { beforeAll, describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

vi.mock("../models/user.model.js");

describe("Auth Controller", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
  });

  it("should return 404 if user not found", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/signin")
      .send({ email: "nouser@test.com", password: "123456" });

    expect(res.statusCode).toBe(404);
  });

  it("should return 400 for wrong password", async () => {
    User.findOne.mockResolvedValue({
      password: bcrypt.hashSync("correct", 10),
      _id: "1",
      user_id: "u1",
      email: "test@test.com",
      username: "test",
      _doc: {},
    });

    const res = await request(app)
      .post("/api/auth/signin")
      .send({ email: "test@test.com", password: "wrong" });

    expect(res.statusCode).toBe(400);
  });

  it("should return 200 on successful sign in with correct credentials", async () => {
    User.findOne.mockResolvedValue({
      password: bcrypt.hashSync("mypassword", 10),
      _id: "id-2",
      user_id: "u2",
      email: "user2@test.com",
      username: "user2",
      _doc: { email: "user2@test.com", username: "user2" },
    });

    const res = await request(app)
      .post("/api/auth/signin")
      .send({ email: "user2@test.com", password: "mypassword" });

    expect(res.statusCode).toBe(200);
  });
});
