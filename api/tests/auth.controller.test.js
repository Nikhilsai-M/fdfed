import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

vi.mock("../models/user.model.js");

describe("Auth Controller", () => {

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

});