import { useEffect, useState } from "react";
import axios from "axios";

export default function SellerOrders() {

  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("sellerToken");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get(
      "http://localhost:3000/api/seller/orders",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setOrders(res.data.orders);
  };

  return (
    <div style={styles.container}>
      <h1>Seller Orders</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Total Amount</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>₹{order.total_amount}</td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#f4f6f9",
    minHeight: "100vh"
  },
  table: {
    width: "100%",
    background: "white",
    borderCollapse: "collapse",
    boxShadow: "0 3px 12px rgba(0,0,0,0.1)"
  }
};