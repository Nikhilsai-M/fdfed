import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const allKeys = Object.keys(localStorage);
    const cartKey = allKeys.find((key) => key.startsWith('cart_'));
    if (!cartKey) {
      navigate('/sign-in');
      return;
    }

    const extractedUserId = cartKey.replace('cart_', '');
    setUserId(extractedUserId);

    let fetchedCart = [];
    try {
      fetchedCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    } catch (error) {
      console.error('Error reading cart:', error);
    }
    setCart(fetchedCart);
  }, [navigate]);

  const determineItemType = (item) => {
    if (item.model && item.ram && item.rom) return 'phone';
    if (item.wattage && item.outputCurrent) return 'charger';
    if (item.design && item.batteryLife) return 'earphone';
    if (item.displaySize && item.displayType && item.batteryRuntime) return 'smartwatch';
    if (item.resolution && item.connectivity && item.type) return 'mouse';
    if (item.processor && item.ram) return 'laptop';
    return 'unknown';
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
    const discount = parseFloat(item.discount || item.pricing?.discount?.replace('%', '') || 0);
    return (price - (price * discount) / 100) * (item.quantity || 1);
  };

  const getItemDetails = (item) => {
    if (item.model && item.ram && item.rom)
      return `${item.brand} ${item.model}<br>${item.ram} RAM | ${item.rom} Storage`;
    if (item.wattage && item.outputCurrent) return `${item.title}<br>${item.wattage}W`;
    if (item.design && item.batteryLife) return `${item.title}<br>${item.design}`;
    if (item.displaySize && item.displayType && item.batteryRuntime)
      return `${item.title}<br>${item.displaySize}"`;
    if (item.resolution && item.connectivity && item.type)
      return `${item.title}<br>${item.type}`;
    if (item.processor && item.ram)
      return `${item.brand} ${item.name || ''}<br>${item.ram} RAM`;
    return item.title || 'Unknown Item';
  };

  // ---- SUMMARY CALCULATION WITH DISCOUNT ----
  const { subtotal, shipping, discountAmount, total } = useMemo(() => {
    const subtotal = cart.reduce((total, item) => total + calculateItemTotal(item), 0);
    const shipping = subtotal > 10000 ? 0 : 99;
    const discountAmount = (subtotal * discountPercent) / 100;
    const total = subtotal - discountAmount + shipping;
    return { subtotal, shipping, discountAmount, total };
  }, [cart, discountPercent]);

  const handleApplyCoupon = () => {
    if (!userId) {
      setMessage({ text: 'User ID not found. Please refresh the page.', type: 'error' });
      return;
    }

    const couponUsedKey = `coupon_used_${userId}`;
    const hasUsedCoupon = localStorage.getItem(couponUsedKey) === 'true';

    if (couponCode.trim().toUpperCase() === 'SMART10') {
      if (hasUsedCoupon) {
        setDiscountPercent(0);
        setMessage({ text: 'Coupon can be used only 1 time.', type: 'error' });
        setCouponCode(''); // Clear the input
      } else {
        setDiscountPercent(10);
        localStorage.setItem(couponUsedKey, 'true');
        setMessage({ text: 'Coupon applied successfully! 10% discount added.', type: 'success' });
        setCouponCode(''); // Clear the input after success
      }
    } else {
      setDiscountPercent(0);
      setMessage({ text: 'Invalid coupon code.', type: 'error' });
      setCouponCode(''); // Clear the input
    }
  };

  const handlePaymentSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePay = async () => {
    if (cart.length === 0) {
      setMessage({ text: 'Your cart is empty.', type: 'error' });
      return;
    }

    // Validate item types before proceeding
    const invalidItems = cart.filter(item => determineItemType(item) === 'unknown');
    if (invalidItems.length > 0) {
      console.error('Invalid items in cart:', invalidItems);
      setMessage({ text: 'Invalid items in cart. Please remove and add them again.', type: 'error' });
      return;
    }

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

      const text = await response.text();
      const result = JSON.parse(text);

      if (!result.success) throw new Error(result.message || 'Failed to save order');

      // ✅ Clear user's cart
      const userCartKey = `cart_${userId}`;
      localStorage.setItem(userCartKey, JSON.stringify([]));
      setCart([]);

      // ✅ Save this order locally
      localStorage.setItem(orderId, JSON.stringify(orderData));

      setMessage({ text: 'Payment successful!', type: 'success' });

      // ✅ Navigate to clean URL (no long query string)
      setTimeout(() => {
        navigate(`/orders/${orderId}`);
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-medium text-sm rounded-lg shadow hover:bg-gray-50 transition-all"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Shopping
            </Link>
          </div>
          <p className="text-gray-500 mt-4">No items in cart.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
          <Link
            to="/"
            className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 font-medium text-sm rounded-lg shadow-md hover:bg-gray-50 hover:shadow-lg transition-all"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ---- ORDER SUMMARY ---- */}
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <i className="fas fa-shopping-cart mr-2 text-blue-500"></i> Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <AnimatePresence>
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:shadow-md"
                  >
                    <img src={item.image} alt={item.title || item.model || item.brand} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900" dangerouslySetInnerHTML={{ __html: getItemDetails(item) }} />
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity || 1}</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">₹{calculateItemTotal(item).toLocaleString('en-IN')}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
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

            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </p>
              {discountPercent > 0 && (
                <p className="flex justify-between text-lg text-green-600">
                  <span>Discount ({discountPercent}%):</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </p>
              )}
              <p className="flex justify-between text-lg">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </p>
              <p className="flex justify-between text-xl font-bold border-t pt-3">
                <span>Total:</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </p>
            </div>
          </motion.div>

          {/* ---- PAYMENT SECTION ---- */}
          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <i className="fas fa-credit-card mr-2 text-blue-500"></i> Payment Details
            </h2>

            <div className="space-y-3 mb-6">
              {paymentMethods.map((pm, index) => (
                <motion.div
                  key={pm.method}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
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
                      <motion.i className="fas fa-check ml-auto text-blue-500" initial={{ scale: 0 }} animate={{ scale: 1 }} />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isProcessing || !selectedPaymentMethod}
              onClick={handlePay}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 ${
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

        {/* ---- MESSAGE ---- */}
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