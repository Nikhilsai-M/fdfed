import { beforeEach, describe, expect, it, vi } from "vitest";

const userMocks = vi.hoisted(() => ({
  findOne: vi.fn(),
  updateOne: vi.fn(),
}));

vi.mock("../models/user.model.js", () => ({
  default: {
    findOne: userMocks.findOne,
    updateOne: userMocks.updateOne,
  },
}));

import { updateCustomerProfile } from "../controllers/customer.controller.js";

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return payload;
    },
  };
}

function buildRequest(body = {}) {
  return {
    user: {
      user_id: "user-1",
    },
    body: {
      first_name: "Nikhil",
      last_name: "Kumar",
      email: "nikhil@example.com",
      phone: "+91 9876543210",
      address: {
        street: "12 Main Road",
        city: "Hyderabad",
        state: "Telangana",
        postal_code: "500001",
        country: "India",
      },
      ...body,
    },
  };
}

describe("customer.controller profile validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid phone numbers with regex validation", async () => {
    const next = vi.fn();

    await updateCustomerProfile(
      buildRequest({ phone: "123" }),
      createResponse(),
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Please enter a valid phone number",
      })
    );
    expect(userMocks.findOne).not.toHaveBeenCalled();
    expect(userMocks.updateOne).not.toHaveBeenCalled();
  });

  it("rejects invalid email addresses with regex validation", async () => {
    const next = vi.fn();

    await updateCustomerProfile(
      buildRequest({ email: "not-an-email" }),
      createResponse(),
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Please enter a valid email address",
      })
    );
    expect(userMocks.findOne).not.toHaveBeenCalled();
  });

  it("rejects incomplete addresses", async () => {
    const next = vi.fn();

    await updateCustomerProfile(
      buildRequest({
        address: {
          street: "12 Main Road",
          city: "",
          state: "Telangana",
          postal_code: "500001",
          country: "India",
        },
      }),
      createResponse(),
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Complete address is required",
      })
    );
    expect(userMocks.updateOne).not.toHaveBeenCalled();
  });

  it("updates the profile for valid user information", async () => {
    const res = createResponse();
    const next = vi.fn();

    userMocks.findOne.mockResolvedValue(null);
    userMocks.updateOne.mockResolvedValue({ acknowledged: true });

    await updateCustomerProfile(buildRequest(), res, next);

    expect(userMocks.findOne).toHaveBeenCalledWith({
      email: "nikhil@example.com",
      user_id: { $ne: "user-1" },
    });
    expect(userMocks.updateOne).toHaveBeenCalledWith(
      { user_id: "user-1" },
      {
        $set: {
          first_name: "Nikhil",
          last_name: "Kumar",
          email: "nikhil@example.com",
          phone: "+91 987654321055",
          "address.street": "12 Main Road",
          "address.city": "Hyderabad",
          "address.state": "Telangana",
          "address.postal_code": "500001",
          "address.country": "India",
        },
      }
    );
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Profile updated successfully",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
