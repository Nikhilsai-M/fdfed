import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../services/cartApi";

const sanitizeAccessory = (item) => {
  const accessory = { ...item };
  delete accessory.itemId;
  delete accessory.quantity;
  delete accessory.price;
  delete accessory.unitPrice;
  delete accessory.originalPrice;
  delete accessory.discount;
  delete accessory.stock;
  delete accessory.available;
  return accessory;
};

const calculateItemTotal = (item) =>
  Number(((Number(item.unitPrice || item.price || 0)) * (item.quantity || 1)).toFixed(2));

const getItemDetails = (item) => {
  if (item.type === "phone") {
    return `${item.brand} ${item.model}\n${item.ram} RAM | ${item.rom} Storage`;
  }

  if (item.type === "laptop") {
    return `${item.title}\n${item.ram} RAM | ${item.storage}`;
  }

  if (item.type === "charger") {
    return `${item.title}\n${item.wattage}W`;
  }

  if (item.type === "earphone") {
    return `${item.title}\n${item.design}`;
  }

  if (item.type === "smartwatch") {
    return `${item.title}\n${item.displaySize}"`;
  }

  if (item.type === "mouse") {
    return `${item.title}\n${item.mouseType || item.connectorType || "Accessory"}`;
  }

  return item.title || "Unknown Item";
};

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const cart = cartItems;

  useEffect(() => {
    const loadCart = async () => {
      try {
        const loadedCart = await getCart();
        setCart(loadedCart?.items || []);
        setUserId(loadedCart?.userId || null);
      } catch (error) {
        console.error("Error reading cart:", error);
        if (error.status === 401 || error.status === 403) {
          navigate("/sign-in");
          return;
        }

        setMessage({ text: error.message || "Unable to load cart.", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [navigate]);

  const { subtotal, shipping, discountAmount, total } = useMemo(() => {
    const calculatedSubtotal = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    const calculatedShipping = calculatedSubtotal > 10000 ? 0 : 99;
    const calculatedDiscountAmount = (calculatedSubtotal * discountPercent) / 100;
    const calculatedTotal = calculatedSubtotal - calculatedDiscountAmount + calculatedShipping;

    return {
      subtotal: calculatedSubtotal,
      shipping: calculatedShipping,
      discountAmount: calculatedDiscountAmount,
      total: calculatedTotal,
    };
  }, [cart, discountPercent]);

  const handleApplyCoupon = () => {
    if (!userId) {
      setMessage({ text: "User ID not found.", type: "error" });
      return;
    }

    const couponUsedKey = `coupon_used_${userId}`;
    const hasUsedCoupon = localStorage.getItem(couponUsedKey) === "true";

    if (couponCode.trim().toUpperCase() === "SMART10") {
      if (hasUsedCoupon) {
        setDiscountPercent(0);
        setMessage({ text: "Coupon can be used only once.", type: "error" });
      } else {
        setDiscountPercent(10);
        localStorage.setItem(couponUsedKey, "true");
        setMessage({
          text: "Coupon applied successfully! 10% discount added.",
          type: "success",
        });
      }

      setCouponCode("");
      return;
    }

    setDiscountPercent(0);
    setMessage({ text: "Invalid coupon code.", type: "error" });
    setCouponCode("");
  };

  const handlePay = async () => {
    if (cart.length === 0) {
      setMessage({ text: "Your cart is empty.", type: "error" });
      return;
    }

    setIsProcessing(true);
    setMessage({ text: "Redirecting to secure payment...", type: "info" });

    const checkoutData = {
      source: "cart",
      userId,
      paymentMethod: "razorpay",
      subtotal,
      shipping,
      discountAmount,
      discountPercent,
      totalAmount: total,
      items: cart.map((item) => ({
        type: item.type,
        id: item.productId || item.id,
        seller_id: item.seller_id || null,
        accessory: sanitizeAccessory(item),
        quantity: Number(item.quantity || 1),
        amount: calculateItemTotal(item),
      })),
    };

    navigate("/payment", {
      state: {
        checkoutData,
      },
    });

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Checkout</h1>

        <Link to="/cart" className="text-blue-600 mb-6 inline-block">
          Back to Cart
        </Link>

        <div className="bg-white rounded-xl p-6 shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

          {loading ? (
            <p>Loading your cart...</p>
          ) : cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cart.map((item) => (
              <div key={item.itemId} className="flex justify-between border-b py-3">
                <span className="whitespace-pre-line">{getItemDetails(item)}</span>
                <span>Rs.{calculateItemTotal(item).toLocaleString("en-IN")}</span>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Apply Coupon</h2>
          <div className="flex gap-3">
            <input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 rounded border border-gray-300 px-4 py-2"
            />
            <button
              onClick={handleApplyCoupon}
              className="rounded bg-emerald-600 px-4 py-2 font-semibold text-white"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Totals</h2>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs.{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `Rs.${shipping}`}</span>
          </div>

          {discountPercent > 0 ? (
            <div className="flex justify-between text-green-600">
              <span>Discount ({discountPercent}%)</span>
              <span>-Rs.{discountAmount.toLocaleString("en-IN")}</span>
            </div>
          ) : null}

          <div className="flex justify-between font-bold text-lg mt-3">
            <span>Total</span>
            <span>Rs.{total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4">Secure Payment</h2>
          <p className="mb-4 text-gray-600">
            Continue to Razorpay to pay using card, UPI, net banking, or wallet.
          </p>

          <button
            onClick={handlePay}
            disabled={loading || isProcessing || cart.length === 0}
            className="w-full py-3 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Pay Now - Rs.{total.toLocaleString("en-IN")}
          </button>
        </div>

        {message.text ? <div className="mt-6 p-4 border rounded">{message.text}</div> : null}
      </div>
    </div>
  );
};

export default Checkout;
