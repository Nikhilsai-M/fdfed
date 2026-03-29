import crypto from "crypto";
import Razorpay from "razorpay";
import Payment from "./payment.model.js";
import { createOrder } from "../../crud/orders.js";

const CURRENCY = "INR";

let razorpayClient = null;

function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

function getRazorpayClient() {
  if (!isRazorpayConfigured()) {
    return null;
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayClient;
}

function toPaise(amount) {
  return Math.round(Number(amount) * 100);
}

function fromPaise(amount) {
  return Number((Number(amount) / 100).toFixed(2));
}

function buildExpectedSignature(orderId, paymentId) {
  return crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

function buildDummyOrderId() {
  return `dummy_order_${Date.now()}`;
}

function buildLog(prefix, data = {}) {
  return `[${new Date().toISOString()}] ${prefix} ${JSON.stringify(data)}`;
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
    razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: `rcpt_${userId}_${Date.now()}`,
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
      receipt: `dummy_receipt_${Date.now()}`,
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

  console.log("PAYMENT_ORDER_CREATED", {
    paymentId: payment._id.toString(),
    razorpayOrderId: razorpayOrder.id,
    amount: payment.amount,
    dummyMode,
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

  if (!payment) {
    throw new Error("Payment record not found");
  }

  if (payment.userId !== userId) {
    throw new Error("Payment does not belong to the current user");
  }

  if (payment.status === "success" && payment.orderId) {
    console.log("PAYMENT_VERIFY_IDEMPOTENT", {
      paymentId: payment._id.toString(),
      orderId: payment.orderId,
    });

    return {
      verified: true,
      duplicate: true,
      payment,
      orderId: payment.orderId,
    };
  }

  const dummyMode = !isRazorpayConfigured() || razorpay_order_id.startsWith("dummy_order_");
  const isSignatureValid = dummyMode
    ? razorpay_signature === "dummy_signature"
    : buildExpectedSignature(razorpay_order_id, razorpay_payment_id) === razorpay_signature;

  payment.razorpay_payment_id = razorpay_payment_id;
  payment.razorpay_signature = razorpay_signature;
  payment.logs.push(
    buildLog("PAYMENT_VERIFY_ATTEMPT", {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      dummyMode,
      isSignatureValid,
    })
  );

  if (!isSignatureValid) {
    payment.status = "failed";
    await payment.save();

    console.log("PAYMENT_VERIFY_FAILED", {
      paymentId: payment._id.toString(),
      razorpayOrderId: razorpay_order_id,
    });

    return {
      verified: false,
      payment,
      reason: "Invalid payment signature",
    };
  }

  const checkoutPayload = payment.checkoutPayload || {};
  const existingOrderId = payment.orderId || null;
  let orderId = existingOrderId;

  if (!existingOrderId) {
    const orderResult = await createOrder(
      userId,
      checkoutPayload.totalAmount || payment.amount,
      checkoutPayload.paymentMethod || payment.paymentMethod || "razorpay",
      checkoutPayload.items || [],
      {
        orderStatus: "Confirmed",
        paymentStatus: "success",
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      }
    );

    if (!orderResult.success) {
      throw new Error(orderResult.message || "Order creation failed after payment verification");
    }

    orderId = orderResult.orderId;
    payment.orderId = orderId;
  }

  payment.status = "success";
  payment.logs.push(
    buildLog("PAYMENT_VERIFIED", {
      orderId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    })
  );
  await payment.save();

  console.log("PAYMENT_VERIFIED", {
    paymentId: payment._id.toString(),
    orderId,
    razorpayOrderId: razorpay_order_id,
  });

  return {
    verified: true,
    duplicate: false,
    payment,
    orderId,
  };
}

export async function getPaymentStatus({ paymentId, orderId, razorpayOrderId, userId }) {
  const query = {};

  if (paymentId) {
    query._id = paymentId;
  } else if (orderId) {
    query.orderId = orderId;
  } else if (razorpayOrderId) {
    query.razorpay_order_id = razorpayOrderId;
  } else {
    throw new Error("paymentId, orderId, or razorpayOrderId is required");
  }

  if (userId) {
    query.userId = userId;
  }

  const payment = await Payment.findOne(query).lean();

  if (!payment) {
    throw new Error("Payment status not found");
  }

  return payment;
}

export function getPaymentPublicConfig() {
  return {
    dummyMode: !isRazorpayConfigured(),
    keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
  };
}
