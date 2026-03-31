import {
  createPaymentOrder,
  getPaymentPublicConfig,
  getPaymentStatus,
  verifyPayment,
} from "../services/payment.service.js";

export async function createOrderController(req, res) {
  try {
    const userId = req.user?.user_id || req.body.userId;
    const {
      amount,
      currency,
      items = [],
      totalAmount,
      subtotal,
      shipping,
      discountAmount,
      discountPercent,
      paymentMethod = "razorpay",
    } = req.body;

    const { payment, order, dummyMode, keyId } = await createPaymentOrder({
      userId,
      amount,
      currency,
      paymentMethod,
      checkoutPayload: {
        items,
        totalAmount: totalAmount || amount,
        subtotal: subtotal ?? amount,
        shipping: shipping ?? 0,
        discountAmount: discountAmount ?? 0,
        discountPercent: discountPercent ?? 0,
        paymentMethod,
      },
    });

    return res.status(201).json({
      success: true,
      paymentId: payment._id,
      order_id: order.id,
      amount: order.amount,
      amountInRupees: payment.amount,
      currency: order.currency,
      dummyMode,
      keyId,
      message: dummyMode
        ? "Razorpay keys missing. Running payment flow in demo mode."
        : "Razorpay order created successfully.",
    });
  } catch (error) {
    console.error("PAYMENT_CREATE_ORDER_ERROR", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment order",
    });
  }
}

export async function verifyPaymentController(req, res) {
  try {
    const result = await verifyPayment({
      userId: req.user.user_id,
      razorpay_order_id: req.body.razorpay_order_id,
      razorpay_payment_id: req.body.razorpay_payment_id,
      razorpay_signature: req.body.razorpay_signature,
    });

    const statusCode = result.verified ? 200 : 400;
    return res.status(statusCode).json({
      success: result.verified,
      verified: result.verified,
      duplicate: result.duplicate || false,
      orderId: result.orderId || null,
      paymentStatus: result.payment.status,
      reason: result.reason || null,
      dummyMode: getPaymentPublicConfig().dummyMode,
    });
  } catch (error) {
    console.error("PAYMENT_VERIFY_ERROR", error);
    return res.status(500).json({
      success: false,
      verified: false,
      message: error.message || "Payment verification failed",
    });
  }
}

export async function getPaymentStatusController(req, res) {
  try {
    const payment = await getPaymentStatus({
      paymentId: req.params.paymentId || req.query.paymentId,
      orderId: req.query.orderId,
      razorpayOrderId: req.query.razorpayOrderId,
      userId: req.user.user_id,
    });

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("PAYMENT_STATUS_ERROR", error);
    return res.status(404).json({
      success: false,
      message: error.message || "Payment status not found",
    });
  }
}
