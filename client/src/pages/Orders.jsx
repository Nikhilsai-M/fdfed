import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
const Orders = () => {
  const [searchParams] = useSearchParams();
  const [recentOrder, setRecentOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderQuery = searchParams.get('order');
    if (orderQuery) {
      try {
        const orderData = JSON.parse(decodeURIComponent(orderQuery));
        setRecentOrder(orderData);
        setOrders([orderData]); // show only this one temporarily
      } catch (e) {
        console.error('Invalid order param', e);
      }
    } else {
      fetch('/api/myorders')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setOrders(data.orders);
        })
        .finally(() => setLoading(false));
    }
  }, [searchParams]);

  if (loading) {
    return <div className="text-center mt-16 text-gray-600">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8">
       <Header />
      <div className="container mx-auto px-4 max-w-5xl">
        {recentOrder && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-300 text-green-700 px-6 py-4 mb-6 rounded-xl shadow-md"
          >
            <i className="fas fa-check-circle mr-2"></i>
            <strong>Thank you for your purchase!</strong> Your order has been placed successfully.
          </motion.div>
        )}

        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-xl shadow">
            <p className="text-gray-600 mb-4">You don’t have any orders yet.</p>
            <Link
              to="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-3 text-blue-600">
                  Order ID: {order.orderId}
                </h3>
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b py-2 text-gray-700"
                  >
                    <span>
                      {item.accessory.title ||
                        item.accessory.model ||
                        item.accessory.series ||
                        'Item'}
                    </span>
                    <span>₹{(item.amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="mt-4 flex justify-between text-gray-800 font-bold">
                  <span>Total:</span>
                  <span>₹{(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Payment: {order.paymentMethod.toUpperCase()} |{' '}
                  {new Date(order.timestamp).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
