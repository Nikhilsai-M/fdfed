import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { redirectIfUnauthorizedResponse } from '../utils/sessionRedirect';
import { motion } from "framer-motion";
import { Download, ArrowLeft } from "lucide-react";
import { API_BASE_URL, buildAssetUrl } from "../utils/api";

const Orders = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const billRef = useRef();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
          credentials: "include",
        });

        if (redirectIfUnauthorizedResponse(response)) {
          return;
        }

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Order not found");
        }

        setOrder(result.order);
      } catch (fetchError) {
        console.error("Order fetch error:", fetchError);
        setError(fetchError.message || "Order not found");
      }
    };

    fetchOrder();
  }, [orderId]);

  const getItemDisplayName = (item) => {
    const acc = item.accessory;
    if (!acc) return "Unnamed Item";

    switch (item.type) {
      case "phone":
        return `${acc.brand || ""} ${acc.model || ""} - ${acc.ram || ""} RAM, ${acc.rom || ""} Storage`;
      case "laptop":
        return acc.name || `${acc.brand || ""} ${acc.series || ""} - ${acc.ram || ""} RAM`;
      default:
        return acc.title || acc.name || acc.brand || "Unnamed Item";
    }
  };

  const downloadTextBill = () => {
    if (!order) return;

    let text = `Order Invoice\n=========================\n`;
    text += `Order ID: ${order.orderId}\n`;
    text += `Date: ${new Date(order.timestamp).toLocaleString()}\n`;
    text += `Payment Mode: ${order.paymentMethod}\n`;
    text += `Payment Status: ${order.paymentStatus || "pending"}\n`;
    text += `-------------------------\nItems:\n`;

    order.items.forEach((item, idx) => {
      const title = getItemDisplayName(item);
      const qty = item.quantity;
      const unit = (item.amount / qty).toFixed(2);
      const total = item.amount.toFixed(2);

      text += `${idx + 1}. ${title}\n   Qty: ${qty}, Unit: Rs.${unit}, Total: Rs.${total}\n`;
    });

    text += `-------------------------\n`;
    text += `TOTAL: Rs.${Number(order.totalAmount || 0).toFixed(2)}\n`;
    text += `=========================\nThank you for your purchase.\n`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${orderId}_invoice.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-gray-600">{error}</p>
        <Link to="/myorders" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
          View All Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-gray-600">Loading order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <motion.div
        ref={billRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8 border"
      >
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold">Order Invoice</h1>
          <span className="text-gray-600">#{order.orderId}</span>
        </div>

        <div className="mb-6 text-gray-700 grid gap-2 md:grid-cols-2">
          <p>
            <strong>Date:</strong> {new Date(order.timestamp).toLocaleString()}
          </p>
          <p>
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
          <p>
            <strong>Payment Status:</strong> {order.paymentStatus || "pending"}
          </p>
          <p>
            <strong>Order Status:</strong> {order.orderStatus || "Pending"}
          </p>
        </div>

        <table className="w-full text-left border-y text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Unit Price</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {item.accessory?.image && (
                      <img
                        src={buildAssetUrl(item.accessory.image)}
                        className="w-12 h-12 rounded border"
                        alt=""
                      />
                    )}
                    <div>
                      <div className="font-medium">{getItemDisplayName(item)}</div>
                      <div className="text-xs text-gray-500">{item.type}</div>
                    </div>
                  </div>
                </td>

                <td className="p-3">{item.quantity}</td>
                <td className="p-3">?{(item.amount / item.quantity).toFixed(2)}</td>
                <td className="p-3">?{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-6 space-y-1 text-gray-800">
          <p className="text-xl font-semibold border-t pt-2">
            Total: ?{Number(order.totalAmount || 0).toFixed(2)}
          </p>
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto mt-6 flex justify-between">
        <Link to="/myorders" className="text-blue-600 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back to Orders
        </Link>

        <button
          onClick={downloadTextBill}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Download className="w-5 h-5" /> Download Invoice
        </button>
      </div>
    </div>
  );
};

export default Orders;
