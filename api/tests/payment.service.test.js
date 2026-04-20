import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildExpectedSignature,
  buildLog,
  buildDummyOrderId,
  fromPaise,
  generateReceipt,
  getPaymentPublicConfig,
  isRazorpayConfigured,
  toPaise,
} from "../services/payment.service.js";

describe("payment.service helpers", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  // ─── toPaise / fromPaise ──────────────────────────────────────────────────

  it("converts rupees to paise and back", () => {
    expect(toPaise(123.45)).toBe(12345);
    expect(fromPaise(12345)).toBe(123.45);
  });

  // ─── Razorpay config ──────────────────────────────────────────────────────

  it("detects missing razorpay configuration and exposes dummy mode", () => {
    vi.stubEnv("RAZORPAY_KEY_ID", "");
    vi.stubEnv("RAZORPAY_KEY_SECRET", "");

    expect(isRazorpayConfigured()).toBe(false);
    expect(getPaymentPublicConfig()).toEqual({
      dummyMode: true,
      keyId: "rzp_test_dummy",
    });
  });

  it("returns dummyMode false when Razorpay keys are present", () => {
    vi.stubEnv("RAZORPAY_KEY_ID", "rzp_live_testkey");
    vi.stubEnv("RAZORPAY_KEY_SECRET", "test_secret_abc");

    expect(isRazorpayConfigured()).toBe(true);
    expect(getPaymentPublicConfig()).toEqual({
      dummyMode: false,
      keyId: "rzp_live_testkey",
    });
  });

  // ─── Signature & Logs ─────────────────────────────────────────────────────

  it("builds expected signatures and structured logs", () => {
    vi.stubEnv("RAZORPAY_KEY_SECRET", "secret");

    expect(buildExpectedSignature("order_1", "payment_1")).toHaveLength(64);
    expect(buildLog("PAYMENT_ORDER_CREATED", { amount: 100 })).toContain(
      "PAYMENT_ORDER_CREATED"
    );
  });

  // ─── Dummy order & receipt helpers ────────────────────────────────────────

  it("buildDummyOrderId starts with dummy_order_ prefix", () => {
    const id = buildDummyOrderId();
    expect(id.startsWith("dummy_order_")).toBe(true);
  });

  it("generateReceipt starts with rcpt_ prefix", () => {
    const receipt = generateReceipt();
    expect(receipt.startsWith("rcpt_")).toBe(true);
  });
});
