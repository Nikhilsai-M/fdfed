import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used for navigation

const Checkout = () => {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

 useEffect(() => {
    // Dynamically find cart key like in Cart component
    const allKeys = Object.keys(localStorage);
    const cartKey = allKeys.find((key) => key.startsWith("cart_user"));
    if (!cartKey) {
      navigate('/sign-in');
      return;
    }

    // Extract userId from cartKey (e.g., "cart_user_1764190130" -> "1764190130")
    const extractedUserId = cartKey.replace("cart_user_", "");
    setUserId(extractedUserId);

    let fetchedCart = [];
    try {
      fetchedCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    } catch (error) {
      console.error("Error reading cart:", error);
    }
    setCart(fetchedCart);
    console.log('Fetched cart on load:', fetchedCart); // Debug log
  }, [navigate]);

  const determineItemType = (item) => {
    if (item.model && item.ram && item.rom) return 'phone';
    if (item.wattage && item.outputCurrent) return 'charger';
    if (item.design && item.batteryLife) return 'earphone';
    if (item.displaySize && item.displayType && item.batteryRuntime) return 'smartwatch';
    if (item.resolution && item.connectivity && item.type) return 'mouse';
    if (item.series && item.processor && item.memory) return 'laptop';
    return 'unknown';
  };

  const sanitizeAccessory = (item) => {
    const accessory = { ...item };
    delete accessory.quantity;
    delete accessory.price;
    delete accessory.discount;
    return accessory;
  };

  const calculateItemTotal = (item) => {
    const price = parseFloat(item.price || item.pricing?.originalPrice || 0);
    const discount = parseFloat(item.discount || item.pricing?.discount?.replace('%', '') || 0);
    return (price - (price * discount / 100)) * (item.quantity || 1);
  };

  const getItemDetails = (item) => {
    const isPhone = item.model && item.ram && item.rom;
    const isCharger = item.wattage && item.outputCurrent;
    const isEarphone = item.design && item.batteryLife;
    const isSmartwatch = item.displaySize && item.displayType && item.batteryRuntime;
    const isMouse = item.resolution && item.connectivity && item.type;
    const isLaptop = item.series && item.processor && item.memory;

    if (isPhone) {
      return `${item.brand} ${item.model}<br>${item.ram} RAM | ${item.rom} Storage`;
    } else if (isCharger) {
      return `${item.title}<br>${item.wattage}W`;
    } else if (isEarphone) {
      return `${item.title}<br>${item.design}`;
    } else if (isSmartwatch) {
      return `${item.title}<br>${item.displaySize}"`;
    } else if (isMouse) {
      return `${item.title}<br>${item.type}`;
    } else if (isLaptop) {
      return `${item.brand} ${item.series}<br>${item.memory.ram} RAM`;
    }
    return item.title || 'Unknown Item';
  };

  const calculateSummary = () => {
    const subtotal = cart.reduce((total, item) => {
      return total + calculateItemTotal(item);
    }, 0);
    const shipping = subtotal > 10000 ? 0 : 100;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  };

  const { subtotal, shipping, total } = calculateSummary();

  const handlePaymentSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePay = async () => {
    if (!selectedPaymentMethod) {
      setMessage({ text: 'Please select a payment method.', type: 'error' });
      return;
    }

    setIsProcessing(true);
    setMessage({ text: 'Processing payment...', type: 'info' });

    const orderId = `ORD-${Date.now()}`;
    const orderData = {
      orderId,
      items: cart.map((item) => ({
        type: determineItemType(item),
        id: item.id,
        accessory: sanitizeAccessory(item),
        quantity: item.quantity || 1,
        amount: calculateItemTotal(item),
      })),
      totalAmount: total,
      paymentMethod: selectedPaymentMethod,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to save order');
      }

      const userCartKey = `cart_${userId}`;
      localStorage.setItem(userCartKey, JSON.stringify([]));
      setCart([]);

      setMessage({ text: 'Payment successful!', type: 'success' });
      setTimeout(() => {
        const orderQuery = encodeURIComponent(JSON.stringify(orderData));
        navigate(`/orders?order=${orderQuery}`);
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      setMessage({ text: `Payment failed: ${error.message}`, type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { method: 'card', icon: 'fa-credit-card', label: 'Credit/Debit Card' },
    { method: 'netbanking', icon: 'fa-university', label: 'Net Banking' },
    { method: 'upi', icon: 'fa-mobile-alt', label: 'UPI' },
    { method: 'cod', icon: 'fa-money-bill', label: 'Cash on Delivery' },
  ];

  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-gray-900 text-center"
          >
            Checkout
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-gray-500 mt-4"
          >
            No items in cart.
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-gray-900 text-center mb-8"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <i className="fas fa-shopping-cart mr-2 text-blue-500"></i>
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              <AnimatePresence>
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <img
                      src={item.image}
                      alt={item.title || item.model || item.brand}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3
                        className="font-medium text-gray-900"
                        dangerouslySetInnerHTML={{ __html: getItemDetails(item) }}
                      />
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity || 1}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{calculateItemTotal(item).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="flex justify-between text-lg">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
              </p>
              <p className="flex justify-between text-lg">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </p>
              <p className="flex justify-between text-xl font-bold border-t pt-3">
                <span>Total:</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </p>
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <i className="fas fa-credit-card mr-2 text-blue-500"></i>
              Payment Details
            </h2>
            <div className="space-y-3 mb-6">
              <AnimatePresence>
                {paymentMethods.map((pm, index) => (
                  <motion.div
                    key={pm.method}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className={`payment-method p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedPaymentMethod === pm.method
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePaymentSelect(pm.method)}
                  >
                    <div className="flex items-center space-x-3">
                      <i className={`fas ${pm.icon} text-2xl text-gray-500`}></i>
                      <span className="font-medium text-gray-900">{pm.label}</span>
                      {selectedPaymentMethod === pm.method && (
                        <motion.i
                          className="fas fa-check ml-auto text-blue-500"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isProcessing || !selectedPaymentMethod}
              onClick={handlePay}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                isProcessing || !selectedPaymentMethod
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg'
              }`}
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-lock"></i>
                  <span>Pay Now - ₹{total.toLocaleString('en-IN')}</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-sm mx-4 ${
                message.type === 'success'
                  ? 'bg-green-500 text-white'
                  : message.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Checkout;