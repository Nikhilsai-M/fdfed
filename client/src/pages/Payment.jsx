import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, CreditCard, Landmark, HandCoins, ArrowLeft, Check, Sparkles } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { price: passedPrice, type, id, accessory, phone, laptop, userId } = location.state || {};
  const product = accessory || phone || laptop;

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [selectedBank, setSelectedBank] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const getDiscountPrice = (item) => {
    if (item.discountPrice) return item.discountPrice;
    if (item.price && item.discountPercentage)
      return item.price - (item.price * item.discountPercentage) / 100;
    return item.price || passedPrice || 0;
  };
  const discount = product?.discountPercentage || 0;
  const actualPrice = getDiscountPrice(product);

  const { subtotal, shipping, discountAmount, total } = useMemo(() => {
    const sub = actualPrice;
    const ship = sub > 10000 ? 0 : 100;
    const discAmount = (sub * discountPercent) / 100;
    return {
      subtotal: sub,
      shipping: ship,
      discountAmount: discAmount,
      total: sub - discAmount + ship,
    };
  }, [actualPrice, discountPercent]);

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
      seller_id: product?.sellerId, // ⭐ REQUIRED
      accessory: sanitized,
      quantity: 1,
      amount: actualPrice,
    },
  ],

  subtotal: actualPrice,
  discountPercent: discount,
  discountAmount: (originalPrice * discount) / 100,
  shipping: 0,

  totalAmount: actualPrice,
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

  const getItemDisplayName = () => {
    if (!product) return "Product";
    if (type === "phone") return `${product.brand} ${product.model}`;
    if (type === "laptop") return product.title || `${product.brand} ${product.series}`;
    return product.title || product.name || "Accessory";
  };

  const originalPrice = product?.originalPrice || passedPrice;
  const showOriginal = originalPrice && originalPrice > actualPrice;

  if (!product || !actualPrice || !type) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-8 rounded-2xl shadow-xl"
        >
          <h1 className="text-2xl font-bold mb-3 text-gray-800">Invalid Payment Request</h1>
          <Link to="/" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            Go Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl"
        />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <Link to="/" className="inline-flex items-center text-gray-700 hover:text-indigo-600 transition-colors duration-300 group">
            <motion.div
              whileHover={{ x: -4 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
            </motion.div>
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Secure Payment
          </h1>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20"
        >
          {/* Order Summary */}
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 border-b pb-3 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg"
          >
            {product.image && (
              <motion.img
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                src={product.image}
                alt={getItemDisplayName()}
                className="w-16 h-16 object-cover rounded-lg shadow-md"
              />
            )}

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{getItemDisplayName()}</h3>
              <p className="text-sm text-gray-500">{type} • Qty: 1</p>
            </div>

            <div className="text-right">
              {showOriginal && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-500 line-through"
                >
                  ₹{originalPrice.toLocaleString("en-IN")}
                </motion.div>
              )}
              <motion.strong 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-green-600 text-lg block"
              >
                ₹{actualPrice.toLocaleString("en-IN")}
              </motion.strong>
            </div>
          </motion.div>

          {/* Coupon */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg mb-4 border border-amber-200"
          >
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 border-2 border-gray-200 p-2 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 outline-none"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleApplyCoupon} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              Apply
            </motion.button>
          </motion.div>

          {/* Price Details */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg"
          >
            <p className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
            </p>
            <AnimatePresence>
              {discountPercent > 0 && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-between text-sm text-green-600 font-medium"
                >
                  <span>Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </motion.p>
              )}
            </AnimatePresence>
            <p className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</span>
            </p>

            <motion.p 
              className="flex justify-between font-bold border-t pt-3 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </motion.p>
          </motion.div>

          {/* Payment Method Selection */}
          <h3 className="font-semibold mb-3 text-gray-800">Choose Payment Method</h3>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-3 mb-6"
          >
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMethod(method.key)}
                className={`p-4 border-2 rounded-xl flex flex-col items-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  selectedMethod === method.key
                    ? "border-indigo-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md"
                }`}
              >
                {selectedMethod === method.key && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
                <method.icon className={`w-7 h-7 mb-2 transition-colors duration-300 ${
                  selectedMethod === method.key ? "text-indigo-600" : "text-gray-600"
                }`} />
                <span className={`text-sm font-medium text-center ${
                  selectedMethod === method.key ? "text-indigo-700" : "text-gray-700"
                }`}>
                  {method.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {selectedMethod && (
              <motion.div 
                key={selectedMethod}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <h3 className="font-semibold mb-3 text-gray-800">Payment Details</h3>

                {selectedMethod === "upi" && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 outline-none"
                      placeholder="yourname@bank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={verifyUpi}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Verify UPI
                    </motion.button>
                  </motion.div>
                )}

                {selectedMethod === "card" && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      maxLength="16"
                      placeholder="Card Number"
                      className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 outline-none"
                      value={cardDetails.number}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, number: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 outline-none"
                        value={cardDetails.expiry}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, expiry: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        maxLength="3"
                        placeholder="CVV"
                        className="border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 outline-none"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, cvv: e.target.value })
                        }
                      />
                    </div>
                  </motion.div>
                )}

                {selectedMethod === "netbanking" && (
                  <motion.select
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 outline-none"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    <option value="">Choose bank</option>
                    <option value="sbi">SBI</option>
                    <option value="hdfc">HDFC</option>
                    <option value="icici">ICICI</option>
                    <option value="axis">Axis</option>
                    <option value="kotak">Kotak</option>
                  </motion.select>
                )}

                {selectedMethod === "cod" && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 p-4 rounded-lg text-sm"
                  >
                    Cash payment of{" "}
                    <strong className="text-amber-700">₹{total.toLocaleString("en-IN")}</strong> on delivery.
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pay Button */}
          <motion.button
            whileHover={{ scale: isProcessing || !selectedMethod ? 1 : 1.02 }}
            whileTap={{ scale: isProcessing || !selectedMethod ? 1 : 0.98 }}
            disabled={isProcessing || !selectedMethod}
            onClick={processPayment}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 relative overflow-hidden ${
              isProcessing || !selectedMethod
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:shadow-xl"
            }`}
          >
            {isProcessing && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
            )}
            {isProcessing ? "Processing..." : `Pay ₹${total.toLocaleString("en-IN")}`}
          </motion.button>
        </motion.div>

        {/* Toast */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-2xl text-white shadow-2xl backdrop-blur-sm ${
                message.type === "success"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : message.type === "error"
                  ? "bg-gradient-to-r from-red-500 to-rose-600"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600"
              }`}
            >
              <div className="flex items-center gap-2">
                {message.type === "success" && <Check className="w-5 h-5" />}
                <span className="font-medium">{message.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PaymentPage;