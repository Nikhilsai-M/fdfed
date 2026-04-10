import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, CreditCard, RefreshCw, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { clearCart as clearBackendCart, getCart as getBackendCart } from "../services/cartApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const determineItemType = (item) => {
  if (item.type === "phone") return "phone";
  if (item.type === "laptop") return "laptop";
  if (item.wattage && item.outputCurrent) return "charger";
  if (item.design && item.batteryLife) return "earphone";
  if (item.displaySize && item.displayType && item.batteryRuntime) return "smartwatch";
  if (item.resolution && item.connectivity && item.type) return "mouse";
  return "unknown";
};

const sanitizeAccessory = (item) => {
  const accessory = { ...item };
  delete accessory.quantity;
  delete accessory.price;
  delete accessory.discount;
  delete accessory.pricing;
  return accessory;
};

const calculateItemTotal = (item) => {
  const price = parseFloat(item.price || item.pricing?.originalPrice || item.pricing?.basePrice || 0);
  const rawDiscount = item.discount || item.pricing?.discount || 0;
  const discount = parseFloat(String(rawDiscount).replace("%", "") || 0);
  return Number(((price - (price * discount) / 100) * (item.quantity || 1)).toFixed(2));
};

const getItemDisplayName = (item) => {
  const accessory = item.accessory || item;

  if (item.type === "phone") {
    return `${accessory.brand || ""} ${accessory.model || ""}`.trim();
  }

  if (item.type === "laptop") {
    return accessory.title || `${accessory.brand || ""} ${accessory.series || accessory.name || ""}`.trim();
  }

  return accessory.title || accessory.name || accessory.brand || "Product";
};

const buildBuyNowCheckoutData = (state) => {
  const product = state?.accessory || state?.phone || state?.laptop;
  const type = state?.type;
  const id = state?.id;
  const price = Number(state?.price || 0);

  if (!product || !type || !id || !price) {
    return null;
  }

  const shipping = price > 10000 ? 0 : 100;

  return {
    source: "buyNow",
    paymentMethod: "razorpay",
    userId: state?.userId || null,
    items: [
      {
        type,
        id,
        seller_id: product.sellerId || product.seller_id || null,
        accessory: sanitizeAccessory(product),
        quantity: 1,
        amount: price,
      },
    ],
    subtotal: price,
    shipping,
    discountAmount: 0,
    discountPercent: 0,
    totalAmount: price + shipping,
  };
};

const buildCheckoutDataFromState = (state) => {
  if (state?.checkoutData?.items?.length) {
    return state.checkoutData;
  }

  return buildBuyNowCheckoutData(state);
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const autoOpenedRef = useRef(false);
  const [checkoutData, setCheckoutData] = useState(() => buildCheckoutDataFromState(location.state));
  const [paymentSession, setPaymentSession] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [hasPaymentFailed, setHasPaymentFailed] = useState(false);
  const { user, token } = useAppSelector((state) => state.auth);

  const authHeaders = useMemo(() => {
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }, [token]);

  useEffect(() => {
    if (checkoutData?.items?.length) {
      return;
    }

    const fallbackData = buildCheckoutDataFromState(location.state);
    if (fallbackData?.items?.length) {
      setCheckoutData(fallbackData);
      return;
    }

    const loadCartFallback = async () => {
      try {
        const cart = await getBackendCart();

        if (!cart?.items?.length) {
          return;
        }

        const subtotal = cart.items.reduce((total, item) => total + calculateItemTotal(item), 0);
        const shipping = subtotal > 10000 ? 0 : 99;

        setCheckoutData({
          source: "cart",
          paymentMethod: "razorpay",
          userId: cart.userId || user?.user_id || location.state?.userId,
          items: cart.items.map((item) => ({
            type: item.type || determineItemType(item),
            id: item.productId || item.id,
            seller_id: item.seller_id || item.sellerId || null,
            accessory: sanitizeAccessory(item),
            quantity: item.quantity || 1,
            amount: calculateItemTotal(item),
          })),
          subtotal,
          shipping,
          discountAmount: 0,
          discountPercent: 0,
          totalAmount: subtotal + shipping,
        });
      } catch (error) {
        console.error("Payment cart fallback error:", error);
      }
    };

    loadCartFallback();
  }, [checkoutData, location.state, user]);

  const createBackendOrder = async () => {
    if (!checkoutData?.items?.length) {
      return;
    }

    setIsCreatingOrder(true);
    setErrorMessage("");
    setStatusMessage("Processing Payment...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: authHeaders,
        credentials: "include",
        body: JSON.stringify({
          source: checkoutData.source || "buyNow",
          userId: user?.user_id || checkoutData.userId,
          amount: checkoutData.totalAmount,
          currency: "INR",
          items: checkoutData.items,
          subtotal: checkoutData.subtotal,
          shipping: checkoutData.shipping,
          discountAmount: checkoutData.discountAmount,
          discountPercent: checkoutData.discountPercent,
          totalAmount: checkoutData.totalAmount,
          paymentMethod: checkoutData.paymentMethod || "razorpay",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to initialize payment");
      }

      setPaymentSession(result);
      setHasPaymentFailed(false);
      setStatusMessage(
        result.dummyMode
          ? "Razorpay keys not found. Demo payment mode is active."
          : "Secure payment session ready."
      );
    } catch (error) {
      console.error("Payment session error:", error);
      setErrorMessage(error.message || "Unable to create payment order");
      setStatusMessage("");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  useEffect(() => {
    if (!checkoutData?.items?.length || paymentSession || isCreatingOrder) {
      return;
    }

    if ((checkoutData.paymentMethod || "razorpay") === "cod") {
      setStatusMessage("Cash on Delivery selected. Review and confirm the order.");
      return;
    }

    createBackendOrder();
  }, [checkoutData, paymentSession, isCreatingOrder]);

  const clearCartAfterPayment = async () => {
    try {
      await clearBackendCart();
    } catch (error) {
      console.error("Unable to clear cart after payment:", error);
    }
  };

  const createCodOrder = async () => {
    setIsVerifyingPayment(true);
    setErrorMessage("");
    setStatusMessage("Placing your order...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: authHeaders,
        credentials: "include",
        body: JSON.stringify({
          source: checkoutData.source || "buyNow",
          totalAmount: checkoutData.totalAmount,
          paymentMethod: "cod",
          items: checkoutData.items,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to place COD order");
      }

      await clearCartAfterPayment();
      navigate("/myorders", {
        replace: true,
        state: { paymentSuccess: true, orderId: result.orderId },
      });
    } catch (error) {
      console.error("COD order error:", error);
      setErrorMessage(error.message || "Unable to place COD order");
      setHasPaymentFailed(true);
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  const verifyPaymentOnServer = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    setIsVerifyingPayment(true);
    setErrorMessage("");
    setStatusMessage("Verifying payment...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/verify-payment`, {
        method: "POST",
        headers: authHeaders,
        credentials: "include",
        body: JSON.stringify({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.verified) {
        throw new Error(result.message || result.reason || "Payment verification failed");
      }

      await clearCartAfterPayment();
      setStatusMessage("Payment verified. Redirecting to your orders...");

      navigate("/myorders", {
        replace: true,
        state: {
          paymentSuccess: true,
          orderId: result.orderId,
          duplicate: result.duplicate,
        },
      });
    } catch (error) {
      console.error("Payment verification error:", error);
      setErrorMessage(error.message || "Payment verification failed");
      setHasPaymentFailed(true);
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  const launchCheckout = async () => {
    if (!paymentSession || !checkoutData) {
      return;
    }

    if ((checkoutData.paymentMethod || "razorpay") === "cod") {
      await createCodOrder();
      return;
    }

    if (paymentSession.dummyMode) {
      await verifyPaymentOnServer({
        razorpay_order_id: paymentSession.order_id,
        razorpay_payment_id: `dummy_payment_${Date.now()}`,
        razorpay_signature: "dummy_signature",
      });
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setErrorMessage("Razorpay SDK failed to load. Check your network and try again.");
      setHasPaymentFailed(true);
      return;
    }

    const razorpay = new window.Razorpay({
      key: paymentSession.keyId,
      amount: paymentSession.amount,
      currency: paymentSession.currency,
      name: "Smart Exchange",
      description: `Order total ₹${checkoutData.totalAmount.toLocaleString("en-IN")}`,
      order_id: paymentSession.order_id,
      handler: async (response) => {
        await verifyPaymentOnServer(response);
      },
      prefill: {
        name: [user?.first_name, user?.last_name].filter(Boolean).join(" "),
        email: user?.email || "",
        contact: user?.phone || "",
      },
      notes: {
        userId: user?.user_id || checkoutData.userId || "",
      },
      theme: {
        color: "#2563eb",
      },
      modal: {
        ondismiss: () => {
          setStatusMessage("Payment window closed. You can retry.");
          setHasPaymentFailed(true);
        },
      },
    });

    razorpay.on("payment.failed", (response) => {
      console.error("Razorpay payment failed:", response.error);
      setErrorMessage(response.error?.description || "Payment failed. Please retry.");
      setHasPaymentFailed(true);
    });

    razorpay.open();
  };

  useEffect(() => {
    if (!paymentSession || autoOpenedRef.current || isCreatingOrder || isVerifyingPayment) {
      return;
    }

    autoOpenedRef.current = true;
    launchCheckout();
  }, [paymentSession, isCreatingOrder, isVerifyingPayment]);

  const retryPayment = async () => {
    setHasPaymentFailed(false);
    setErrorMessage("");

    if ((checkoutData?.paymentMethod || "razorpay") === "cod") {
      await createCodOrder();
      return;
    }

    if (paymentSession) {
      await launchCheckout();
      return;
    }

    autoOpenedRef.current = false;
    await createBackendOrder();
  };

  const orderSummary = useMemo(() => {
    if (!checkoutData) {
      return null;
    }

    return {
      items: checkoutData.items || [],
      subtotal: Number(checkoutData.subtotal || 0),
      shipping: Number(checkoutData.shipping || 0),
      discountAmount: Number(checkoutData.discountAmount || 0),
      totalAmount: Number(checkoutData.totalAmount || 0),
      paymentMethod: checkoutData.paymentMethod || "razorpay",
    };
  }, [checkoutData]);

  if (!orderSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="max-w-md rounded-3xl bg-white p-8 shadow-xl text-center">
          <h1 className="text-2xl font-bold text-slate-900">Invalid payment request</h1>
          <p className="mt-3 text-slate-600">Checkout data was not found. Start again from cart or buy now.</p>
          <Link to="/checkout" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-white">
            Go to checkout
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#eff6ff_30%,#f8fafc_70%)] px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/checkout" className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />
            Back to checkout
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Secure payment flow
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur"
          >
            <h1 className="text-3xl font-bold text-slate-900">Payment</h1>
            <p className="mt-2 text-slate-600">
              Razorpay handles cards, UPI, wallets, and netbanking in one checkout.
            </p>

            <div className="mt-8 rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-slate-900">
                    {orderSummary.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay Checkout"}
                  </p>
                  <p className="text-sm text-slate-600">
                    {paymentSession?.dummyMode
                      ? "Demo mode is enabled because Razorpay keys are missing."
                      : "The backend payment order has been created and linked to this checkout."}
                  </p>
                </div>
              </div>
            </div>

            {statusMessage ? (
              <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800">
                {statusMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={launchCheckout}
                  disabled={
                    isCreatingOrder ||
                    isVerifyingPayment ||
                    ((orderSummary.paymentMethod || "razorpay") !== "cod" && !paymentSession)
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                {(isCreatingOrder || isVerifyingPayment) && <RefreshCw className="h-4 w-4 animate-spin" />}
                {isVerifyingPayment
                  ? "Processing Payment..."
                  : orderSummary.paymentMethod === "cod"
                  ? "Confirm COD Order"
                  : "Pay Now"}
              </button>

              {hasPaymentFailed ? (
                <button
                  onClick={retryPayment}
                  disabled={isCreatingOrder || isVerifyingPayment}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry payment
                </button>
              ) : null}
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-xl"
          >
            <h2 className="text-xl font-bold text-slate-900">Order summary</h2>

            <div className="mt-6 space-y-4">
              {orderSummary.items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{getItemDisplayName(item)}</p>
                      <p className="mt-1 text-sm capitalize text-slate-500">{item.type}</p>
                      <p className="mt-1 text-sm text-slate-600">Quantity: {item.quantity || 1}</p>
                    </div>
                    <p className="font-semibold text-slate-900">
                      ₹{Number(item.amount || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-3 border-t border-slate-200 pt-6 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{orderSummary.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Shipping</span>
                <span>{orderSummary.shipping === 0 ? "FREE" : `₹${orderSummary.shipping.toLocaleString("en-IN")}`}</span>
              </div>
              {orderSummary.discountAmount > 0 ? (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Discount</span>
                  <span>-₹{orderSummary.discountAmount.toLocaleString("en-IN")}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                <span>Total</span>
                <span>₹{orderSummary.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {paymentSession?.dummyMode ? (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                Demo mode lets you test the full flow without live Razorpay keys.
              </div>
            ) : null}

            {!hasPaymentFailed && paymentSession ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Payment session linked
              </div>
            ) : null}
          </motion.aside>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
