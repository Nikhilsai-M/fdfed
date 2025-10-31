// src/components/MyOrders.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/myorders');
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setOrders(result.orders || []);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
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
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-100 py-8">
       <Header />
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">My Orders</h1>
          <p className="text-gray-600">Track and review your purchase history</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {orders.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200"
            >
              <i className="fas fa-shopping-cart text-gray-400 text-7xl mb-6"></i>
              <p className="text-gray-500 text-xl mb-8">No orders yet. Your shopping journey begins here!</p>
              <Link
                to="/"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <i className="fas fa-arrow-left mr-2"></i>Start Shopping
              </Link>
            </motion.div>
          ) : (
            orders.map((order, index) => {
              let itemsHtml = null;
              if (order.items && order.items.length > 0) {
                itemsHtml = (
                  <motion.div
                    variants={itemVariants}
                    className="space-y-3 mb-6"
                  >
                    <h4 className="text-lg font-semibold text-gray-700 flex items-center">
                      <i className="fas fa-list-ul mr-2 text-indigo-500"></i>Items:
                    </h4>
                    <ul className="space-y-2">
                      {order.items.map((item, itemIndex) => (
                        <motion.li
                          key={itemIndex}
                          variants={itemVariants}
                          className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">
                              {item.accessory.brand || ''} {item.accessory.title || item.accessory.model || item.accessory.series || 'Item'}
                            </div>
                            <div className="text-sm text-gray-600">Quantity: {item.quantity || 1}</div>
                          </div>
                          <div className="text-right font-bold text-green-600 ml-4">
                            ₹{item.amount.toLocaleString('en-IN')}
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                );
              } else {
                itemsHtml = (
                  <motion.p
                    variants={itemVariants}
                    className="mb-6 text-gray-500 p-4 bg-gray-50 rounded-lg"
                  >
                    No item details available.
                  </motion.p>
                );
              }

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="order-item bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      <i className="fas fa-tag mr-3 text-purple-500"></i>
                      Order #{index + 1} - {order.orderId}
                    </h3>
                    <div className="text-right">
                      <span className="block text-2xl font-bold text-green-600">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                      <span className="text-sm text-gray-500">Total Paid</span>
                    </div>
                  </div>

                  {itemsHtml}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium text-blue-700">Payment Method</span>
                      <span className="font-semibold text-gray-800">{order.paymentMethod ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1) : 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-green-700">Order Date</span>
                      <span className="font-semibold text-gray-800">{order.timestamp ? new Date(order.timestamp).toLocaleString() : new Date().toLocaleString()}</span>
                    </div>
                    <div className="md:col-span-1 lg:col-span-1 flex justify-center md:justify-end">
                      <button
                        onClick={() => window.location.href = `/orders?orderId=${order.orderId}`}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 shadow-md transform hover:scale-105 transition-all duration-200"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <i className="fas fa-arrow-left mr-2"></i>← Back to Home
          </Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders;