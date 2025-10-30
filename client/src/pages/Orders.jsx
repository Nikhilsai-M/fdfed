// src/components/Orders.jsx
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion'; // Optional: Install framer-motion for advanced animations

const Orders = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderId = searchParams.get('orderId');
        if (orderId) {
          // Fetch single order
          const response = await fetch(`/api/orders/${orderId}`);
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          const result = await response.json();
          if (result.success) {
            setOrder(result.order);
          } else {
            throw new Error(result.message);
          }
        } else {
          // Fetch all orders
          const response = await fetch('/api/myorders');
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          const result = await response.json();
          if (result.success) {
            setOrders(result.orders);
          } else {
            throw new Error(result.message);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const downloadReceipt = (orderId, orderData) => {
    const itemDetails = orderData.items && orderData.items.length > 0
      ? orderData.items.map(item => `${item.accessory.brand || ''} ${item.accessory.title || item.accessory.model || item.accessory.series || 'Item'} (Qty: ${item.quantity || 1})`).join(', ')
      : 'No items';

    const receiptContent = `
Order Receipt
-------------
Order ID: ${orderId}
Item Details: ${itemDetails}
Amount Paid: ₹${(orderData.totalAmount || 0).toLocaleString('en-IN')}
Payment Method: ${(orderData.paymentMethod || 'Unknown').charAt(0).toUpperCase() + (orderData.paymentMethod || 'unknown').slice(1)}
Date: ${orderData.timestamp ? new Date(orderData.timestamp).toLocaleString() : new Date().toLocaleString()}
-------------
Thank you for shopping with us!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `receipt_${orderId}.txt`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-600 text-xl font-semibold"
        >
          Error: {error}
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Orders Management</h1>
          <p className="text-gray-600">View your recent purchases and order history</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {order ? (
            <>
              <motion.div
                variants={itemVariants}
                className="order-header text-center mb-8 p-6 bg-white rounded-2xl shadow-xl border border-green-100"
              >
                <motion.i
                  className="fas fa-check-circle text-green-500 text-6xl mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                />
                <h2 className="text-3xl font-bold text-green-600">Thank You for Your Purchase!</h2>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="order-details bg-white p-8 rounded-2xl shadow-lg mb-8 border border-gray-100 overflow-hidden"
              >
                <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                  <i className="fas fa-receipt mr-2 text-blue-500"></i>
                  Order Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between bg-gray-50 p-4 rounded-lg">
                    <span className="font-medium text-gray-700">Order ID:</span>
                    <span id="order-id" className="font-bold text-blue-600">{order.orderId || 'Generating...'}</span>
                  </div>
                  {order.items && order.items.length > 0 ? (
                    <>
                      {order.items.map((item, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="order-item bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border-l-4 border-blue-400 hover:shadow-md transition-shadow duration-300"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-semibold text-gray-800 flex-1">
                              <i className="fas fa-box mr-2 text-indigo-500"></i>
                              {item.accessory.brand || ''} {item.accessory.title || item.accessory.model || item.accessory.series || 'Item'}
                            </p>
                            <span className="ml-4 text-sm text-gray-500">Qty: {item.quantity || 1}</span>
                          </div>
                          <p className="text-right font-bold text-green-600">₹{(item.amount || 0).toLocaleString('en-IN')}</p>
                        </motion.div>
                      ))}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between text-lg font-bold text-gray-900">
                          <span>Total Amount:</span>
                          <span className="text-green-600">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>Payment Method:</span>
                          <span>{order.paymentMethod ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1) : 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Date:</span>
                          <span>{order.timestamp ? new Date(order.timestamp).toLocaleString() : new Date().toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <motion.p
                      variants={itemVariants}
                      className="text-center text-gray-500 py-8"
                    >
                      No items in this order.
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </>
          ) : orders && orders.length > 0 ? (
            <>
              <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold mb-8 text-gray-800"
              >
                Your Orders History
              </motion.h2>
              {orders.map((o, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="order-details bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <i className="fas fa-shopping-bag mr-2 text-purple-500"></i>
                    Order #{index + 1} - {o.orderId}
                  </h3>
                  {o.items && o.items.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {o.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {item.accessory.brand || ''} {item.accessory.title || item.accessory.model || item.accessory.series || 'Item'}
                            </p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                          </div>
                          <p className="font-bold text-green-600">₹{(item.amount || 0).toLocaleString('en-IN')}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 mb-4">No items in this order.</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 pt-4 border-t border-gray-200">
                    <div className="flex justify-between"><span className="font-medium">Total:</span> <span className="font-bold text-green-600">₹{(o.totalAmount || 0).toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span>Payment:</span> <span>{o.paymentMethod ? o.paymentMethod.charAt(0).toUpperCase() + o.paymentMethod.slice(1) : 'Not specified'}</span></div>
                    <div className="flex justify-between"><span>Date:</span> <span>{o.timestamp ? new Date(o.timestamp).toLocaleString() : new Date().toLocaleString()}</span></div>
                  </div>
                </motion.div>
              ))}
            </>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 bg-white rounded-2xl shadow-lg"
            >
              <i className="fas fa-inbox text-gray-400 text-6xl mb-4"></i>
              <p className="text-gray-500 text-lg mb-6">No orders found.</p>
              <Link to="/" className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Start Shopping
              </Link>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="order-actions flex flex-wrap gap-4 justify-center mt-12 p-4 bg-white rounded-xl shadow-md"
        >
          <Link
            to="/"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <i className="fas fa-home mr-2"></i>Continue Shopping
          </Link>
          <Link
            to="/myorders"
            className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <i className="fas fa-list mr-2"></i>View All Orders
          </Link>
          {order && (
            <button
              onClick={() => downloadReceipt(order.orderId, order)}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <i className="fas fa-download mr-2"></i>Download Receipt
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Orders;