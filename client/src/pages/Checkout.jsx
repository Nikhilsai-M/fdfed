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
    if (item.model && item.ram && item.rom) return `${item.brand} ${item.model}\n${item.ram} RAM | ${item.rom} Storage`;
    if (item.wattage && item.outputCurrent) return `${item.title}\n${item.wattage}W`;
    if (item.design && item.batteryLife) return `${item.title}\n${item.design}`;
    if (item.displaySize && item.displayType && item.batteryRuntime) return `${item.title}\n${item.displaySize}"`;
    if (item.resolution && item.connectivity && item.type) return `${item.title}\n${item.type}`;
    if (item.processor && item.ram) return `${item.brand} ${item.name || ''}\n${item.ram} RAM`;
    return item.title || 'Unknown Item';
  };

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
        setCouponCode('');
      } else {
        setDiscountPercent(10);
        localStorage.setItem(couponUsedKey, 'true');
        setMessage({ text: 'Coupon applied successfully! 10% discount added.', type: 'success' });
        setCouponCode('');
      }
    } else {
      setDiscountPercent(0);
      setMessage({ text: 'Invalid coupon code.', type: 'error' });
      setCouponCode('');
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
      userId,
      items: cart.map((item) => ({
        type: determineItemType(item),
        id: item.id,
        accessory: sanitizeAccessory(item),
        quantity: item.quantity || 1,
        amount: calculateItemTotal(item),
      })),
      subtotal,
      discountPercent,
      discountAmount,
      shipping,
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

      const userCartKey = `cart_${userId}`;
      localStorage.setItem(userCartKey, JSON.stringify([]));
      setCart([]);

      localStorage.setItem(orderId, JSON.stringify(orderData));

      setMessage({ text: 'Payment successful!', type: 'success' });
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <motion.div 
        className="max-w-4xl mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Checkout
          </h1>
          <Link 
            to="/cart" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 group transition-all duration-300"
          >
            <motion.span
              className="inline-block"
              whileHover={{ x: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              ←
            </motion.span>
            <span className="relative">
              Back to Shopping
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </span>
          </Link>
        </motion.div>

        {/* ORDER SUMMARY */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 mb-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
            Order Summary
          </h2>
          
          {cart.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-gray-500 text-center py-8"
            >
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-lg">Your cart is empty.</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              <motion.div className="space-y-3">
                {cart.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-between items-center py-4 px-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span className="text-gray-700 whitespace-pre-line">{getItemDetails(item)}</span>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">Qty: {item.quantity || 1}</div>
                      <div className="font-bold text-lg text-blue-600">
                        ₹{calculateItemTotal(item).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* COUPON INPUT */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-dashed border-amber-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 text-6xl opacity-10">🎫</div>
                  <div className="flex gap-2 relative z-10">
                    <motion.input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      whileFocus={{ scale: 1.02 }}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all duration-300 bg-white"
                    />
                    <motion.button
                      onClick={handleApplyCoupon}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Apply
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 space-y-3 text-base bg-gray-50 p-5 rounded-xl"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-800">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            
            <AnimatePresence>
              {discountPercent > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-between items-center text-green-600"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xl">🎉</span>
                    Discount ({discountPercent}%):
                  </span>
                  <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-semibold text-gray-800">
                {shipping === 0 ? (
                  <span className="text-green-600 font-bold">FREE 🎁</span>
                ) : (
                  `₹${shipping}`
                )}
              </span>
            </div>
            
            <motion.div 
              className="flex justify-between items-center font-bold text-xl border-t-2 border-gray-300 pt-4 mt-4"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <span className="text-gray-800">Total:</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-2xl">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* PAYMENT SECTION */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-to-b from-green-500 to-teal-500 rounded-full"></span>
            Payment Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {paymentMethods.map((pm, index) => (
              <motion.button
                key={index}
                onClick={() => handlePaymentSelect(pm.method)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`p-5 border-2 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-300 ${
                  selectedPaymentMethod === pm.method
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                }`}
              >
                <motion.i 
                  className={`fas ${pm.icon} text-2xl ${
                    selectedPaymentMethod === pm.method ? 'text-blue-600' : 'text-gray-600'
                  }`}
                  animate={selectedPaymentMethod === pm.method ? { rotate: [0, -10, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                />
                <span className="font-semibold text-gray-700">{pm.label}</span>
                {selectedPaymentMethod === pm.method && (
                  <motion.i 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="fas fa-check ml-auto text-blue-500 text-xl"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {isProcessing ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block rounded-full h-16 w-16 border-4 border-t-blue-600 border-r-purple-600 border-b-pink-600 border-l-blue-400"
              />
              <motion.p 
                className="mt-4 text-gray-600 text-lg font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Processing your payment...
              </motion.p>
            </motion.div>
          ) : (
            <motion.button
              onClick={handlePay}
              disabled={isProcessing || cart.length === 0}
              whileHover={{ scale: cart.length === 0 ? 1 : 1.02 }}
              whileTap={{ scale: cart.length === 0 ? 1 : 0.98 }}
              className={`w-full py-4 font-bold text-lg rounded-xl transition-all duration-300 ${
                cart.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-2xl'
              }`}
            >
              {cart.length === 0 ? (
                'Add Items to Cart First'
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Pay Now - ₹{total.toLocaleString('en-IN')}</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              )}
            </motion.button>
          )}
        </motion.div>

        {/* MESSAGE */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`mt-6 p-5 rounded-xl shadow-2xl border-l-4 ${
                message.type === 'success' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-500' 
                  : message.type === 'info'
                  ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 border-blue-500'
                  : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <motion.span 
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {message.type === 'success' ? '✅' : message.type === 'info' ? 'ℹ️' : '⚠️'}
                </motion.span>
                <span className="font-semibold text-lg">{message.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Checkout;