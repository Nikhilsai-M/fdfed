import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, CreditCard, Landmark, HandCoins } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Extract parameters from URL
  const price = parseFloat(queryParams.get("price")) || 0;
  const type = queryParams.get("type") || "unknown";
  const id = queryParams.get("id") || "unknown";
  const accessory = JSON.parse(queryParams.get("accessory") || "{}");

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    { key: "upi", label: "UPI", icon: Wallet },
    { key: "card", label: "Credit/Debit Card", icon: CreditCard },
    { key: "netbanking", label: "Net Banking", icon: Landmark },
    { key: "cod", label: "Cash on Delivery", icon: HandCoins },
  ];

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const verifyUpi = () => {
    const valid = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId);
    if (valid) showMessage("✅ UPI ID verified successfully!", "success");
    else showMessage("⚠️ Please enter a valid UPI ID", "error");
  };

  const processPayment = async () => {
    if (!selectedMethod) {
      showMessage("Please select a payment method.", "error");
      return;
    }

    if (type === "unknown" || id === "unknown") {
      showMessage("Invalid order details. Please try again.", "error");
      return;
    }

    setIsProcessing(true);
    showMessage("Processing payment...", "info");

    const orderId = `ORD-${Date.now()}`;
    const orderData = {
      orderId,
      items: [
        {
          type,
          id,
          accessory,
          quantity: 1,
          amount: price,
        },
      ],
      totalAmount: price,
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
      if (!result.success) throw new Error(result.message || "Failed to save order");

      showMessage("🎉 Payment successful!", "success");
      setTimeout(() => navigate(`/orders?orderId=${result.orderId}`), 2000);
    } catch (err) {
      showMessage("Payment failed: " + err.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentDetails = () => {
    switch (selectedMethod) {
      case "upi":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <input
              type="text"
              placeholder="Enter UPI ID (e.g., yourname@upi)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={verifyUpi}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Verify
            </button>
          </motion.div>
        );
      case "card":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <input
              type="text"
              placeholder="Card Number"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="MM/YY"
                className="w-1/2 border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="CVV"
                className="w-1/2 border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </motion.div>
        );
      case "netbanking":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <select className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select Bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
            </select>
          </motion.div>
        );
      case "cod":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-700"
          >
            <p>
              You'll pay ₹{price.toLocaleString("en-IN")} in cash when your order
              is delivered.
            </p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Complete Your Payment
        </h1>

        <div className="text-center mb-6">
          <p className="text-gray-600">Amount to Pay</p>
          <h2 className="text-3xl font-bold text-green-600">₹{price.toLocaleString("en-IN")}</h2>
          <p className="text-sm text-gray-500 mt-2">
            Purchasing: {type} (ID: {id})
          </p>
          {accessory?.brand && (
            <p className="text-sm text-gray-500">
              Item: {accessory.brand} {accessory.title}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="font-semibold text-gray-700 text-lg">
            Choose Payment Method
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {paymentMethods.map((m) => (
              <motion.div
                key={m.key}
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedMethod === m.key
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedMethod(m.key)}
              >
                <m.icon className="w-8 h-8 mb-2 text-gray-700" />
                <span className="text-gray-800 font-medium">{m.label}</span>
              </motion.div>
            ))}
          </div>

          {selectedMethod && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              {renderPaymentDetails()}
            </motion.div>
          )}

          <button
            onClick={processPayment}
            disabled={isProcessing}
            className={`w-full mt-4 py-3 rounded-xl font-semibold text-white transition ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </motion.div>

      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-6 px-6 py-3 rounded-full text-white font-medium shadow-lg ${
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
