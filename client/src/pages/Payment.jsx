// client/src/pages/PaymentPage.jsx
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Wallet, CreditCard, Landmark, HandCoins, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Accept laptop, phone, accessory
  const { price, type, id, accessory, phone, laptop, userId } = location.state || {};

  // Unified product object
  const product = accessory || phone || laptop;

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [selectedBank, setSelectedBank] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // ---- SUMMARY CALCULATION ----
  const { subtotal, shipping, discountAmount, total } = useMemo(() => {
    const subtotal = price || 0;
    const shipping = subtotal > 10000 ? 0 : 100;
    const discountAmount = (subtotal * discountPercent) / 100;
    return {
      subtotal,
      shipping,
      discountAmount,
      total: subtotal - discountAmount + shipping,
    };
  }, [price, discountPercent]);

  const paymentMethods = [
    { key: "upi", label: "UPI", icon: Wallet },
    { key: "card", label: "Credit/Debit Card", icon: CreditCard },
    { key: "netbanking", label: "Net Banking", icon: Landmark },
    { key: "cod", label: "Cash on Delivery", icon: HandCoins },
  ];

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  // ---- COUPON ----
  const handleApplyCoupon = () => {
    if (!userId) return showMessage("User ID not found. Please refresh.", "error");

    const key = `coupon_used_${userId}`;
    const used = localStorage.getItem(key) === "true";

    if (couponCode.trim().toUpperCase() === "SMART10") {
      if (used) {
        showMessage("Coupon can be used only once.", "error");
      } else {
        localStorage.setItem(key, "true");
        setDiscountPercent(10);
        showMessage("Coupon applied! 10% discount added.", "success");
      }
    } else {
      showMessage("Invalid coupon code.", "error");
      setDiscountPercent(0);
    }
    setCouponCode("");
  };

  // ---- VALIDATIONS ----
  const verifyUpi = () => {
    const valid = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId);
    showMessage(valid ? "UPI Verified!" : "Invalid UPI ID", valid ? "success" : "error");
    return valid;
  };

  const validateCard = () => {
    if (!cardDetails.number || cardDetails.number.length !== 16)
      return showMessage("Enter a valid 16-digit card number", "error");
    if (!cardDetails.expiry.includes("/"))
      return showMessage("Expiry format must be MM/YY", "error");
    if (!cardDetails.cvv || cardDetails.cvv.length !== 3)
      return showMessage("Enter a valid 3-digit CVV", "error");
    return true;
  };

  // ---- PAYMENT PROCESS ----
  const processPayment = async () => {
    if (!selectedMethod) return showMessage("Select a payment method.", "error");

    if (selectedMethod === "upi" && !verifyUpi()) return;
    if (selectedMethod === "card" && !validateCard()) return;
    if (selectedMethod === "netbanking" && !selectedBank)
      return showMessage("Select bank.", "error");

    if (!type || !id || !product)
      return showMessage("Invalid order data. Try again.", "error");

    setIsProcessing(true);
    showMessage("Processing payment...", "info");

    const orderId = `ORD-${Date.now()}`;

    const sanitized = { ...product };
    delete sanitized.quantity;
    delete sanitized.pricing;
    delete sanitized.price;
    delete sanitized.discount;

    const orderData = {
      orderId,
      userId: userId || "guest",
      items: [
        {
          type,
          id,
          accessory: sanitized,
          quantity: 1,
          amount: price,
        },
      ],
      subtotal,
      discountPercent,
      discountAmount,
      shipping,
      totalAmount: total,
      paymentMethod: selectedMethod,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Could not save order");

      localStorage.setItem(orderId, JSON.stringify(orderData));

      showMessage("Payment Successful! Redirecting...", "success");

      setTimeout(() => navigate(`/orders/${orderId}`), 2000);
    } catch (err) {
      showMessage("Payment Failed: " + err.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // ---- PRODUCT NAME ----
  const getItemDisplayName = () => {
    if (!product) return "Product";

    if (type === "phone") return `${product.brand} ${product.model}`;
    if (type === "laptop") return product.title || `${product.brand} ${product.series}`;

    return product.title || product.name || "Accessory";
  };

  // ---- INVALID REQUEST ----
  if (!product || !price || !type) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-3">Invalid Payment Request</h1>
          <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Link>
          <h1 className="text-2xl font-bold">Secure Payment</h1>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          {/* Order Summary */}
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

          <div className="flex items-center gap-3 border-b pb-3 mb-4">
            {product.image && (
              <img
                src={product.image}
                alt={getItemDisplayName()}
                className="w-12 h-12 object-cover rounded-lg"
              />
            )}

            <div className="flex-1">
              <h3 className="font-medium">{getItemDisplayName()}</h3>
              <p className="text-sm text-gray-500">{type} • Qty: 1</p>
            </div>

            <strong className="text-green-600 text-lg">
              ₹{subtotal.toLocaleString("en-IN")}
            </strong>
          </div>

          {/* Coupon */}
          <div className="flex gap-2 bg-gray-50 p-4 rounded-lg mb-4">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon"
              className="flex-1 border p-2 rounded-lg"
            />
            <button onClick={handleApplyCoupon} className="bg-blue-600 text-white px-4 rounded-lg">
              Apply
            </button>
          </div>

          {/* Price Details */}
          <div className="space-y-2 mb-6">
            <p className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </p>
            {discountPercent > 0 && (
              <p className="flex justify-between text-sm text-green-600">
                <span>Discount ({discountPercent}%)</span>
                <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
              </p>
            )}
            <p className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </p>

            <p className="flex justify-between font-bold border-t pt-2 text-lg">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </p>
          </div>

          {/* Payment Method Selection */}
          <h3 className="font-semibold mb-3">Choose Payment Method</h3>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {paymentMethods.map((method) => (
              <motion.div
                key={method.key}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedMethod(method.key)}
                className={`p-3 border-2 rounded-xl flex flex-col items-center cursor-pointer ${
                  selectedMethod === method.key
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <method.icon className="w-6 h-6 mb-1" />
                <span className="text-sm">{method.label}</span>
              </motion.div>
            ))}
          </div>

          {selectedMethod && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Payment Details</h3>

              {/* Dynamic Inputs */}
              {selectedMethod === "upi" && (
                <div className="space-y-4">
                  <input
                    type="text"
                    className="w-full border p-3 rounded-lg"
                    placeholder="yourname@bank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <button
                    onClick={verifyUpi}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg"
                  >
                    Verify UPI
                  </button>
                </div>
              )}

              {selectedMethod === "card" && (
                <div className="space-y-4">
                  <input
                    type="text"
                    maxLength="16"
                    placeholder="Card Number"
                    className="w-full border p-3 rounded-lg"
                    value={cardDetails.number}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, number: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="border p-3 rounded-lg"
                      value={cardDetails.expiry}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, expiry: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      maxLength="3"
                      placeholder="CVV"
                      className="border p-3 rounded-lg"
                      value={cardDetails.cvv}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cvv: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {selectedMethod === "netbanking" && (
                <select
                  className="w-full border p-3 rounded-lg"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                >
                  <option value="">Choose bank</option>
                  <option value="sbi">SBI</option>
                  <option value="hdfc">HDFC</option>
                  <option value="icici">ICICI</option>
                  <option value="axis">Axis</option>
                  <option value="kotak">Kotak</option>
                </select>
              )}

              {selectedMethod === "cod" && (
                <div className="bg-yellow-50 border p-4 rounded-lg text-sm">
                  Cash payment of{" "}
                  <strong>₹{total.toLocaleString("en-IN")}</strong> on delivery.
                </div>
              )}
            </div>
          )}

          {/* Pay Button */}
          <button
            disabled={isProcessing || !selectedMethod}
            onClick={processPayment}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
              isProcessing || !selectedMethod
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isProcessing ? "Processing..." : `Pay ₹${total.toLocaleString("en-IN")}`}
          </button>
        </motion.div>

        {/* Toast */}
        {message.text && (
          <div
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full text-white shadow-lg ${
              message.type === "success"
                ? "bg-green-500"
                : message.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
