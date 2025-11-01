import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, ArrowLeft } from "lucide-react";

const Orders = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const billRef = useRef();

  useEffect(() => {
    const data = localStorage.getItem(orderId);
    if (data) setOrder(JSON.parse(data));
  }, [orderId]);

  // 🧾 Function to create a plain text invoice
  const downloadTextBill = () => {
    if (!order) return;

    let text = `🧾 Order Invoice\n`;
    text += `=====================\n`;
    text += `Order ID: ${order.orderId}\n`;
    text += `Date: ${new Date(order.timestamp).toLocaleString()}\n`;
    text += `Payment Method: ${order.paymentMethod}\n`;
    text += `---------------------\n`;
    text += `Items:\n`;

    order.items.forEach((item, idx) => {
      const title = item.accessory?.title || "Unnamed Item";
      const qty = item.quantity;
      const price = (item.amount / qty).toFixed(2);
      const total = item.amount.toFixed(2);
      text += `${idx + 1}. ${title}\n   Qty: ${qty}, Price: ₹${price}, Total: ₹${total}\n`;
    });

    text += `---------------------\n`;
    text += `Subtotal: ₹${order.subtotal.toFixed(2)}\n`;
    text += `Shipping: ₹${order.shipping.toFixed(2)}\n`;
    if (order.discountAmount > 0)
      text += `Discount: -₹${order.discountAmount.toFixed(2)}\n`;
    text += `TOTAL: ₹${order.totalAmount.toFixed(2)}\n`;
    text += `=====================\n`;
    text += `Thank you for your purchase! 🙌\n`;

    // Create blob and trigger download
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${orderId}_invoice.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!order)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-600">
        <p>Order not found.</p>
        <Link
          to="/orders"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View All Orders
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <motion.div
        ref={billRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200"
      >
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Order Invoice</h1>
          <span className="text-gray-600">Order ID: {order.orderId}</span>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">
            <strong>Date:</strong>{" "}
            {new Date(order.timestamp).toLocaleString()}
          </p>
          <p className="text-gray-700">
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
        </div>

        <table className="w-full text-left border-t border-b border-gray-300 mb-6 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Price</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.accessory?.image}
                      alt={item.accessory?.title}
                      className="w-12 h-12 rounded-md border"
                    />
                    <span>{item.accessory?.title}</span>
                  </div>
                </td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">
                  ₹{(item.amount / item.quantity).toFixed(2)}
                </td>
                <td className="p-3">₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right space-y-2 text-gray-800">
          <p>Subtotal: ₹{order.subtotal.toFixed(2)}</p>
          <p>Shipping: ₹{order.shipping.toFixed(2)}</p>
          {order.discountAmount > 0 && (
            <p>Discount: -₹{order.discountAmount.toFixed(2)}</p>
          )}
          <p className="text-xl font-semibold border-t pt-2">
            Total: ₹{order.totalAmount.toFixed(2)}
          </p>
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto flex justify-between mt-6">
        <Link
          to="/myorders"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft className="w-5 h-5" /> View All Orders
        </Link>
        <button
          onClick={downloadTextBill}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Download className="w-5 h-5" /> Download Invoice
        </button>
      </div>
    </div>
  );
};

export default Orders;
