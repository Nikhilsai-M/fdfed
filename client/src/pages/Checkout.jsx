import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

const Checkout = () => {

  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {

    const allKeys = Object.keys(localStorage);
    const cartKey = allKeys.find((key) => key.startsWith("cart_user_"));

    if (!cartKey) {
      navigate("/sign-in");
      return;
    }

    const extractedUserId = cartKey.replace("cart_user_", "");
    setUserId(extractedUserId);

    try {
      const fetchedCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
      console.log("Fetched cart from localStorage:", fetchedCart);
      setCart(fetchedCart);
    } catch (error) {
      console.error("Error reading cart:", error);
    }

  }, [navigate]);



  const determineItemType = (item) => {

    if (item.type==='phone') return "phone";
    if (item.type==='laptop') return "laptop";
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

    const price = parseFloat(item.price || item.pricing?.originalPrice || 0);
    const discount = parseFloat(item.discount || item.pricing?.discount?.replace("%", "") || 0);

    return (price - (price * discount) / 100) * (item.quantity || 1);
  };



  const getItemDetails = (item) => {

    if (item.model && item.ram && item.rom)
      return `${item.brand} ${item.model}\n${item.ram} RAM | ${item.rom} Storage`;

    if (item.wattage && item.outputCurrent)
      return `${item.title}\n${item.wattage}W`;

    if (item.design && item.batteryLife)
      return `${item.title}\n${item.design}`;

    if (item.displaySize && item.displayType && item.batteryRuntime)
      return `${item.title}\n${item.displaySize}"`;

    if (item.resolution && item.connectivity && item.type)
      return `${item.title}\n${item.type}`;

    if (item.processor && item.ram)
      return `${item.brand} ${item.name || ""}\n${item.ram} RAM`;

    return item.title || "Unknown Item";
  };



  const { subtotal, shipping, discountAmount, total } = useMemo(() => {

    const subtotal = cart.reduce((t, item) => t + calculateItemTotal(item), 0);

    const shipping = subtotal > 10000 ? 0 : 99;

    const discountAmount = (subtotal * discountPercent) / 100;

    const total = subtotal - discountAmount + shipping;

    return { subtotal, shipping, discountAmount, total };

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

    } else {

      setDiscountPercent(0);
      setMessage({ text: "Invalid coupon code.", type: "error" });
      setCouponCode("");
    }
  };

  const handlePay = async () => {

    if (cart.length === 0) {
      setMessage({ text: "Your cart is empty.", type: "error" });
      return;
    }

    const invalidItems = cart.filter(
      (item) => determineItemType(item) === "unknown"
    );

    if (invalidItems.length > 0) {

      setMessage({
        text: "Invalid items in cart. Please remove them.",
        type: "error",
      });

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
        type: determineItemType(item),
        id: item._id || item.id,
        seller_id: item.seller_id || item.sellerId || null,
        accessory: sanitizeAccessory(item),
        quantity: item.quantity || 1,
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
          ← Back to Shopping
        </Link>



        <div className="bg-white rounded-xl p-6 shadow mb-6">

          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

          {cart.length === 0 ? (

            <p>Your cart is empty</p>

          ) : (

            cart.map((item, index) => (

              <div
                key={index}
                className="flex justify-between border-b py-3"
              >

                <span>{getItemDetails(item)}</span>

                <span>
                  ₹{calculateItemTotal(item).toLocaleString("en-IN")}
                </span>

              </div>

            ))

          )}

        </div>



        <div className="bg-white rounded-xl p-6 shadow mb-6">

          <h2 className="text-xl font-bold mb-4">Totals</h2>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
          </div>

          {discountPercent > 0 && (

            <div className="flex justify-between text-green-600">
              <span>Discount ({discountPercent}%)</span>
              <span>-₹{discountAmount}</span>
            </div>

          )}

          <div className="flex justify-between font-bold text-lg mt-3">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

        </div>



        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4">Secure Payment</h2>
          <p className="mb-4 text-gray-600">
            Continue to Razorpay to pay using card, UPI, net banking, or wallet.
          </p>



          <button
            onClick={handlePay}
            disabled={isProcessing || cart.length === 0}
            className="w-full py-3 bg-blue-600 text-white rounded"
          >

            Pay Now - ₹{total}

          </button>

        </div>



        {message.text && (

          <div className="mt-6 p-4 border rounded">

            {message.text}

          </div>

        )}

      </div>

    </div>
  );
};

export default Checkout;
