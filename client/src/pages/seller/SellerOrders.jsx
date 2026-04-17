import React, { useEffect, useState } from "react";
import axios from "axios";
import { handleAxiosUnauthorized } from '../../utils/sessionRedirect';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }

  .order-card {
    animation: fadeUp 0.45s ease both;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }
  .order-card:hover {
    box-shadow: 0 12px 36px rgba(99,102,241,0.10) !important;
    transform: translateY(-2px);
  }

  .item-card {
    transition: background 0.16s ease;
  }
  .item-card:hover {
    background: #f0f0ff !important;
  }

  .back-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #818cf8;
    font-weight: 500;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: opacity 0.16s;
  }
  .back-btn:hover { opacity: 0.7; }

  .skeleton {
    background: linear-gradient(90deg, #f1f5f9 25%, #e8eef5 50%, #f1f5f9 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 10px;
  }
`;

const Spinner = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "80px 0" }}>
    <div style={{
      width: 40, height: 40,
      border: "3px solid #e2e8f0",
      borderTop: "3px solid #6366f1",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }} />
    <p style={{ color: "#94a3b8", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Loading orders…</p>
  </div>
);

const EmptyState = () => (
  <div style={{
    textAlign: "center",
    background: "#fff",
    padding: "72px 40px",
    borderRadius: 20,
    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
    animation: "fadeUp 0.4s ease both",
  }}>
    <div style={{
      width: 72, height: 72, borderRadius: 20,
      background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 32, margin: "0 auto 20px",
    }}>📭</div>
    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#1e293b", marginBottom: 8 }}>
      No Orders Yet
    </h3>
    <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>
      Your products haven't been purchased yet.<br />Orders will appear here once customers start buying.
    </p>
  </div>
);

const statusColor = (index) => {
  const palette = [
    { bg: "#eef2ff", color: "#6366f1", border: "#c7d2fe" },
    { bg: "#d1fae5", color: "#059669", border: "#a7f3d0" },
    { bg: "#fef3c7", color: "#d97706", border: "#fde68a" },
    { bg: "#f0f9ff", color: "#0284c7", border: "#bae6fd" },
  ];
  return palette[index % palette.length];
};

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("sellerToken");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/seller/orders",
        { withCredentials: true }
      );
      setOrders(res.data.orders);
    } catch (error) {
      console.error("Failed to fetch seller orders", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.items.reduce((s, i) => s + i.amount, 0), 0
  );
  const totalItems = orders.reduce((sum, order) => sum + order.items.length, 0);

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh", background: "#f1f3f9", fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── TOP BAR ── */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          padding: "0 44px",
          height: 62,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button className="back-btn" onClick={() => window.location.href = "/seller/dashboard"}>
              ← Dashboard
            </button>
            <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.12)" }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: "-0.01em" }}>
              Seller Orders
            </span>
          </div>
          {!loading && orders.length > 0 && (
            <span style={{ fontSize: 12, color: "#64748b", letterSpacing: "0.04em" }}>
              {orders.length} orders found
            </span>
          )}
        </div>

        <div style={{ padding: "36px 44px" }}>

          {/* ── PAGE HEADING ── */}
          <div style={{ marginBottom: 28, animation: "fadeUp 0.35s ease both" }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: "#0f172a", letterSpacing: "-0.03em" }}>
              Order Management
            </h1>
            <p style={{ color: "#64748b", marginTop: 5, fontSize: 14 }}>
              Manage and track all your product sales
            </p>
          </div>

          {/* ── SUMMARY PILLS ── */}
          {!loading && orders.length > 0 && (
            <div style={{ display: "flex", gap: 14, marginBottom: 32, animation: "fadeUp 0.4s 0.05s ease both", opacity: 0, animationFillMode: "forwards" }}>
              {[
                { label: "Total Orders", val: orders.length, color: "#6366f1", bg: "#eef2ff" },
                { label: "Total Items Sold", val: totalItems, color: "#0ea5e9", bg: "#e0f2fe" },
                { label: "Total Revenue", val: `₹${totalRevenue.toFixed(2)}`, color: "#10b981", bg: "#d1fae5" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "14px 22px",
                  boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  border: `1.5px solid ${s.bg}`,
                }}>
                  <span style={{
                    minWidth: 40, height: 36, borderRadius: 9, background: s.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: s.color, padding: "0 8px",
                  }}>{s.val}</span>
                  <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── STATES ── */}
          {loading ? (
            <Spinner />
          ) : orders.length === 0 ? (
            <EmptyState />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {orders.map((order, orderIdx) => {
                const orderTotal = order.items.reduce((sum, item) => sum + item.amount, 0);
                const accent = statusColor(orderIdx);

                return (
                  <div
                    key={order.orderId}
                    className="order-card"
                    style={{
                      background: "#fff",
                      borderRadius: 18,
                      boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
                      overflow: "hidden",
                      animationDelay: `${orderIdx * 0.07}s`,
                      borderLeft: `4px solid ${accent.color}`,
                    }}
                  >
                    {/* Order Header */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px 26px",
                      borderBottom: "1px solid #f1f5f9",
                      background: "#fafbfc",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{
                          width: 42, height: 42, borderRadius: 12,
                          background: accent.bg, border: `1.5px solid ${accent.border}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 16,
                        }}>📦</div>
                        <div>
                          <h3 style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 700, fontSize: 16, color: "#0f172a",
                          }}>
                            Order <span style={{ color: accent.color }}>#{order.orderId}</span>
                          </h3>
                          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
                            📅 {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Order Total</p>
                        <p style={{
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 800, fontSize: 22, color: "#10b981", letterSpacing: "-0.02em",
                        }}>₹{orderTotal}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ padding: "16px 26px", display: "flex", flexDirection: "column", gap: 10 }}>
                      <p style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
                        {order.items.length} Item{order.items.length !== 1 ? "s" : ""}
                      </p>

                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="item-card"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "#f8fafc",
                            padding: "14px 18px",
                            borderRadius: 12,
                            border: "1px solid #f1f5f9",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{
                              width: 38, height: 38, borderRadius: 10,
                              background: accent.bg, display: "flex",
                              alignItems: "center", justifyContent: "center", fontSize: 16,
                              flexShrink: 0,
                            }}>🛍️</div>
                            <div>
                              <h4 style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 4 }}>
                                {item.accessory?.brand} {item.accessory?.title}
                              </h4>
                              <div style={{ display: "flex", gap: 8 }}>
                                <span style={{
                                  fontSize: 11, fontWeight: 600,
                                  background: "#f1f5f9", color: "#64748b",
                                  padding: "2px 9px", borderRadius: 20,
                                }}>
                                  {item.type}
                                </span>
                                <span style={{
                                  fontSize: 11, fontWeight: 600,
                                  background: accent.bg, color: accent.color,
                                  padding: "2px 9px", borderRadius: 20,
                                }}>
                                  Qty: {item.quantity}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 700, fontSize: 16, color: "#1e293b",
                            whiteSpace: "nowrap",
                          }}>
                            ₹{item.amount}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div style={{
                      padding: "12px 26px",
                      background: "#fafbfc",
                      borderTop: "1px solid #f1f5f9",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 8,
                    }}>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>Subtotal across {order.items.length} item{order.items.length !== 1 ? "s" : ""}:</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#10b981" }}>₹{orderTotal}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}