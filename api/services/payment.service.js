import crypto from "crypto";
import Razorpay from "razorpay";
import Payment from "../models/payment.model.js";
import { createOrder } from "../crud/orders.js";
import { clearCartByUserId } from "./cart.service.js";

const CURRENCY = "INR";

let razorpayClient = null;

export function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

function getRazorpayClient() {
  if (!isRazorpayConfigured()) return null;

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayClient;
}

export function toPaise(amount) {
  return Math.round(Number(amount) * 100);
}

export function fromPaise(amount) {
  return Number((Number(amount) / 100).toFixed(2));
}

export function buildExpectedSignature(orderId, paymentId) {
  return crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

export function buildDummyOrderId() {
  return `dummy_order_${Date.now()}`;
}

export function buildLog(prefix, data = {}) {
  return `[${new Date().toISOString()}] ${prefix} ${JSON.stringify(data)}`;
}

export function generateReceipt() {
  return `rcpt_${Date.now()}`;
}

export async function createPaymentOrder({
  userId,
  amount,
  currency = CURRENCY,
  checkoutPayload = {},
  paymentMethod = "razorpay",
}) {
  if (!userId || !amount || Number(amount) <= 0) {
    throw new Error("A valid userId and amount are required");
  }

  const razorpay = getRazorpayClient();
  const amountInPaise = toPaise(amount);

  let razorpayOrder;
  let dummyMode = false;

  if (razorpay) {
    const receipt = generateReceipt();

    razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt,
      notes: {
        userId,
        source: "marketplace-checkout",
      },
    });
  } else {
    dummyMode = true;
    razorpayOrder = {
      id: buildDummyOrderId(),
      amount: amountInPaise,
      currency,
      receipt: generateReceipt(),
    };
  }

  const payment = await Payment.create({
    userId,
    amount: fromPaise(razorpayOrder.amount),
    currency: razorpayOrder.currency || currency,
    razorpay_order_id: razorpayOrder.id,
    status: "pending",
    paymentMethod,
    checkoutPayload,
    logs: [
      buildLog("PAYMENT_ORDER_CREATED", {
        razorpayOrderId: razorpayOrder.id,
        amount: fromPaise(razorpayOrder.amount),
        dummyMode,
      }),
    ],
  });

  return {
    payment,
    order: razorpayOrder,
    dummyMode,
    keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
  };
}

export async function verifyPayment({
  userId,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  const payment = await Payment.findOne({ razorpay_order_id });

  if (!payment) throw new Error("Payment record not found");
  if (payment.userId !== userId) throw new Error("Unauthorized payment");

  if (payment.status === "success" && payment.orderId) {
    return {
      verified: true,
      duplicate: true,
      payment,
      orderId: payment.orderId,
    };
  }

  const dummyMode =
    !isRazorpayConfigured() || razorpay_order_id.startsWith("dummy_order_");

  const isValid = dummyMode
    ? razorpay_signature === "dummy_signature"
    : buildExpectedSignature(
        razorpay_order_id,
        razorpay_payment_id
      ) === razorpay_signature;

  if (!isValid) {
    payment.status = "failed";
    await payment.save();

    return {
      verified: false,
      payment,
      reason: "Invalid signature",
    };
  }

  let orderId = payment.orderId;

  if (!orderId) {
    const payload = payment.checkoutPayload || {};

    const result = await createOrder(
      userId,
      payload.totalAmount || payment.amount,
      payload.paymentMethod || "razorpay",
      payload.items || [],
      {
        orderStatus: "Confirmed",
        paymentStatus: "success",
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      }
    );

    if (!result.success) {
      throw new Error(result.message);
    }

    orderId = result.orderId;
    payment.orderId = orderId;

    if (payload.source === "cart") {
      await clearCartByUserId(userId);
    }
  }

  payment.status = "success";
  await payment.save();

  return {
    verified: true,
    duplicate: false,
    payment,
    orderId,
  };
}

export async function getPaymentStatus({ paymentId, orderId, razorpayOrderId, userId }) {
  const query = paymentId
    ? { _id: paymentId }
    : orderId
    ? { orderId }
    : { razorpay_order_id: razorpayOrderId };

  if (userId) query.userId = userId;

  const payment = await Payment.findOne(query).lean();
  if (!payment) throw new Error("Payment not found");

  return payment;
}

export function getPaymentPublicConfig() {
  return {
    dummyMode: !isRazorpayConfigured(),
    keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
  };
}
