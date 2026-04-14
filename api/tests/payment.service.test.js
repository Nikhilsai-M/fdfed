import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildExpectedSignature,
  buildLog,
  fromPaise,
  getPaymentPublicConfig,
  isRazorpayConfigured,
  toPaise,
} from "../services/payment.service.js";

describe("payment.service helpers", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("converts rupees to paise and back", () => {
    expect(toPaise(123.45)).toBe(12345);
    expect(fromPaise(12345)).toBe(123.45);
  });

  it("detects missing razorpay configuration and exposes dummy mode", () => {
    vi.stubEnv("RAZORPAY_KEY_ID", "");
    vi.stubEnv("RAZORPAY_KEY_SECRET", "");

    expect(isRazorpayConfigured()).toBe(false);
    expect(getPaymentPublicConfig()).toEqual({
      dummyMode: true,
      keyId: "rzp_test_dummy",
    });
  });

  it("builds expected signatures and structured logs", () => {
    vi.stubEnv("RAZORPAY_KEY_SECRET", "secret");

    expect(buildExpectedSignature("order_1", "payment_1")).toHaveLength(64);
    expect(buildLog("PAYMENT_ORDER_CREATED", { amount: 100 })).toContain(
      "PAYMENT_ORDER_CREATED"
    );
  });
});
