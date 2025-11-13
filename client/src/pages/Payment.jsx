import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Wallet, CreditCard, Landmark, HandCoins, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from location state (passed from details page via /api/orders/buy/:type/:id)
  const { price, type, id, accessory, userId } = location.state || {};

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [selectedBank, setSelectedBank] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // ---- SUMMARY CALCULATION WITH DISCOUNT ----
  const { subtotal, shipping, discountAmount, total } = useMemo(() => {
    const subtotal = price || 0;
    const shipping = subtotal > 10000 ? 0 : 100;
    const discountAmount = (subtotal * discountPercent) / 100;
    const total = subtotal - discountAmount + shipping;
    return { subtotal, shipping, discountAmount, total };
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

  const handleApplyCoupon = () => {
    if (!userId) {
      showMessage("User ID not found. Please refresh the page.", "error");
      return;
    }

    const couponUsedKey = `coupon_used_${userId}`;
    const hasUsedCoupon = localStorage.getItem(couponUsedKey) === 'true';

    if (couponCode.trim().toUpperCase() === 'SMART10') {
      if (hasUsedCoupon) {
        setDiscountPercent(0);
        showMessage("Coupon can be used only 1 time.", "error");
        setCouponCode(''); // Clear the input
      } else {
        setDiscountPercent(10);
        localStorage.setItem(couponUsedKey, 'true');
        showMessage("Coupon applied successfully! 10% discount added.", "success");
        setCouponCode(''); // Clear the input after success
      }
    } else {
      setDiscountPercent(0);
      showMessage("Invalid coupon code.", "error");
      setCouponCode(''); // Clear the input
    }
  };

  const verifyUpi = () => {
    const valid = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId);
    if (valid) showMessage("✅ UPI ID verified successfully!", "success");
    else showMessage("⚠️ Please enter a valid UPI ID", "error");
    return valid;
  };

  const validateCard = () => {
    if (!cardDetails.number || cardDetails.number.length !== 16) {
      showMessage("Please enter a valid 16-digit card number", "error");
      return false;
    }
    if (!cardDetails.expiry || !cardDetails.expiry.includes('/')) {
      showMessage("Please enter expiry date in MM/YY format", "error");
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
      showMessage("Please enter a valid 3-digit CVV", "error");
      return false;
    }
    return true;
  };

  const processPayment = async () => {
    if (!selectedMethod) {
      showMessage("Please select a payment method.", "error");
      return;
    }

    // Validate payment details based on method
    if (selectedMethod === "upi" && !verifyUpi()) return;
    if (selectedMethod === "card" && !validateCard()) return;
    if (selectedMethod === "netbanking" && !selectedBank) {
      showMessage("Please select a bank", "error");
      return;
    }

    if (!type || !id || !accessory || subtotal === 0) {
      showMessage("Invalid order details. Please try again.", "error");
      return;
    }

    setIsProcessing(true);
    showMessage("Processing payment...", "info");

    const orderId = `ORD-${Date.now()}`;
    
    // Calculate order details to match Orders component expectations
    const orderData = {
      orderId,
      userId: userId || 'guest',
      items: [
        {
          type,
          id,
          accessory: sanitizeAccessory(accessory),
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
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!result.success) throw new Error(result.message || 'Failed to save order');

      // Save order locally
      localStorage.setItem(orderId, JSON.stringify(orderData));

      showMessage("🎉 Payment successful! Redirecting...", "success");
      
      // Navigate to order confirmation
      setTimeout(() => {
        navigate(`/orders/${orderId}`);
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      showMessage(`Payment failed: ${error.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const sanitizeAccessory = (item) => {
    if (!item) return {};
    const accessory = { ...item };
    delete accessory.quantity;
    delete accessory.price;
    delete accessory.discount;
    delete accessory.pricing;
    return accessory;
  };

  const getItemDisplayName = () => {
    if (!accessory) return "Product";
    // Enhanced to handle phones (brand + model), laptops (brand + series or name), and accessories (title)
    if (accessory.title) return accessory.title;
    if (accessory.name) return accessory.name; // For laptops
    if (accessory.brand) {
      const modelPart = accessory.model || accessory.series || '';
      return `${accessory.brand}${modelPart ? ` ${modelPart}` : ''}`;
    }
    return "Product";
  };

  const renderPaymentDetails = () => {
    switch (selectedMethod) {
      case "upi":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID
              </label>
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={verifyUpi}
              className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Verify UPI ID
            </button>
          </motion.div>
        );
      case "card":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                maxLength={16}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  maxLength={3}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </motion.div>
        );
      case "netbanking":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bank
            </label>
            <select 
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose your bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="kotak">Kotak Mahindra Bank</option>
            </select>
          </motion.div>
        );
      case "cod":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
          >
            <p className="text-yellow-800 text-sm">
              You'll pay <strong>₹{total.toLocaleString("en-IN")}</strong> in cash when your order is delivered.
            </p>
            <p className="text-yellow-700 text-xs mt-2">
              Additional ₹50 may be charged for cash handling.
            </p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // If no data is passed, show error
  if (!price || !type || !accessory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Payment Request</h1>
          <p className="text-gray-600 mb-6">Please go back and try again.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Shopping
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Secure Payment</h1>
        </div>

        {/* Payment Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          {/* Order Summary */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h2>
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b">
              {accessory.image && (
                <img 
                  src={accessory.image} 
                  alt={getItemDisplayName()}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{getItemDisplayName()}</h3>
                <p className="text-sm text-gray-500 capitalize">{type} • Qty: 1</p>
              </div>
              <p className="text-lg font-bold text-green-600">₹{subtotal.toLocaleString("en-IN")}</p>
            </div>

            {/* ---- COUPON INPUT ---- */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4 flex items-center space-x-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring focus:ring-blue-200 outline-none"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Apply
              </button>
            </div>

            <div className="space-y-2">
              <p className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </p>
              {discountPercent > 0 && (
                <p className="flex justify-between text-sm text-green-600">
                  <span>Discount ({discountPercent}%):</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </p>
              )}
              <p className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </p>
              <p className="flex justify-between text-base font-bold border-t pt-2">
                <span>Total:</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 text-lg mb-4">
              Choose Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedMethod === method.key
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedMethod(method.key)}
                >
                  <method.icon className="w-6 h-6 mb-2 text-gray-700" />
                  <span className="text-sm font-medium text-gray-800 text-center">
                    {method.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          {selectedMethod && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6"
            >
              <h3 className="font-semibold text-gray-700 mb-3">Payment Details</h3>
              {renderPaymentDetails()}
            </motion.div>
          )}

          {/* Pay Button */}
          <button
            onClick={processPayment}
            disabled={isProcessing || !selectedMethod}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 transition-all ${
              isProcessing || !selectedMethod
                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                <span>Pay ₹{total.toLocaleString("en-IN")}</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Security Note */}
        <div className="text-center text-sm text-gray-500">
          <p>🔒 Your payment is secure and encrypted</p>
        </div>
      </div>

      {/* Message Toast */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full text-white font-medium shadow-lg ${
            message.type === "success"
              ? "bg-green-500"
              : message.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {message.text}
        </motion.div>
      )}
    </div>
  );
};

export default PaymentPage;