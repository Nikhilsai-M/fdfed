import { useEffect, useState } from "react";
import axios from "axios";
import { handleAxiosUnauthorized } from '../../utils/sessionRedirect';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.35); }
    70%  { box-shadow: 0 0 0 10px rgba(99,102,241,0); }
    100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
  }

  .stat-card { animation: fadeUp 0.5s ease both; }
  .stat-card:nth-child(1) { animation-delay: 0.05s; }
  .stat-card:nth-child(2) { animation-delay: 0.12s; }
  .stat-card:nth-child(3) { animation-delay: 0.19s; }

  .table-row { transition: background 0.18s ease; }
  .table-row:hover { background: #f8f7ff !important; }

  .nav-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    text-align: left;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    padding: 11px 14px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background 0.18s, color 0.18s;
    letter-spacing: 0.01em;
  }
  .nav-btn:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .nav-btn.active { background: rgba(99,102,241,0.18); color: #818cf8; }

  .action-btn {
    border: none;
    border-radius: 7px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 7px 14px;
    transition: opacity 0.18s, transform 0.15s;
  }
  .action-btn:hover { opacity: 0.87; transform: translateY(-1px); }
  .action-btn:active { transform: translateY(0); }
`;

const Icon = ({ name }) => {
  const icons = {
    dashboard: "▤",
    inventory: "⊞",
    add: "⊕",
    orders: "📋",
    profile: "◯",
    logout: "⇥",
    products: "📦",
    revenue: "₹",
    box: "☐",
  };
  return <span style={{ fontSize: 15, lineHeight: 1 }}>{icons[name] || "•"}</span>;
};

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, revenue: 0 });

  const token = localStorage.getItem("sellerToken");

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/seller/products", {
        withCredentials: true,
      });
      setProducts(res.data.products);
    } catch (err) { if (handleAxiosUnauthorized(err, 'seller')) return; console.error(err); }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/seller/dashboard", {
        withCredentials: true,
      });
      setStats(res.data.stats);
    } catch (err) { if (handleAxiosUnauthorized(err, 'seller')) return; console.error(err); }
  };

  const deleteProduct = async (id, category) => {
    try {
      await axios.delete(`http://localhost:3000/api/seller/products/${id}`, {
        data: { category },
        withCredentials: true,
      });
      fetchProducts();
    } catch (err) { if (handleAxiosUnauthorized(err, 'seller')) return; console.error(err); }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:3000/api/seller/logout", {}, { withCredentials: true });
    } catch (err) { console.error(err); }
    localStorage.removeItem("sellerToken");
    window.location.href = "/seller/login";
  };

  const statCards = [
  {
    label: "Total Products",
    value: products.length,
    icon: "box",
    accent: "#6366f1",
    bg: "#eef2ff"
  },
  {
    label: "Total Orders",
    value: stats.totalOrders ?? 0,
    icon: "orders",
    accent: "#0ea5e9",
    bg: "#e0f2fe"
  },
  {
    label: "Total Revenue",
    value: `₹${Number(stats.revenue ?? 0).toFixed(2)}`,
    icon: "revenue",
    accent: "#10b981",
    bg: "#d1fae5"
  },
];

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: "#f1f3f9", fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: 230,
          background: "linear-gradient(170deg, #0f172a 0%, #1e1b4b 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "30px 18px",
          gap: 4,
          position: "sticky",
          top: 0,
          height: "100vh",
          boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
        }}>
          <div style={{ marginBottom: 32, paddingLeft: 6 }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: "-0.02em" }}>
              Seller<span style={{ color: "#818cf8" }}>Panel</span>
            </p>
            <p style={{ fontSize: 11, color: "#64748b", marginTop: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>Management Suite</p>
          </div>

          <button className="nav-btn active"><Icon name="dashboard" /> Dashboard</button>
          <button className="nav-btn" onClick={() => window.location.href = "/seller/manage-inventory"}><Icon name="inventory" /> Manage Inventory</button>
          <button className="nav-btn" onClick={() => window.location.href = "/seller/add-product"}><Icon name="add" /> Add Product</button>
          <button className="nav-btn" onClick={() => window.location.href = "/seller/orders"}><Icon name="orders" /> Orders</button>
          <button className="nav-btn" onClick={() => window.location.href = "/seller/profile"}><Icon name="profile" /> Profile And Analytics</button>

          <div style={{ marginTop: "auto" }}>
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 16 }} />
            <button
              className="nav-btn"
              onClick={logout}
              style={{ color: "#f87171", width: "100%" }}
            >
              <Icon name="logout" /> Logout
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={{ flex: 1, padding: "40px 44px", overflowY: "auto" }}>

          {/* Header */}
          <div style={{ marginBottom: 36, animation: "fadeUp 0.4s ease both" }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: "#0f172a", letterSpacing: "-0.03em" }}>
              Dashboard
            </h1>
            <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>Welcome back — here's what's happening today.</p>
          </div>

          {/* Stat Cards */}
          <div style={{ display: "flex", gap: 20, marginBottom: 44 }}>
            {statCards.map((s, i) => (
              <div
                key={i}
                className="stat-card"
                style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: 16,
                  padding: "24px 26px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  borderTop: `3px solid ${s.accent}`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  position: "absolute", top: 18, right: 20,
                  width: 38, height: 38, borderRadius: 10,
                  background: s.bg, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>
                  <Icon name={s.icon} />
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginBottom: 10 }}>{s.label}</p>
                <p style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: "#0f172a", letterSpacing: "-0.02em" }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Products Table */}
          <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", overflow: "hidden", animation: "fadeUp 0.5s 0.2s ease both", opacity: 0, animationFillMode: "forwards" }}>
            <div style={{ padding: "22px 28px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: "#0f172a" }}>Your Products</h2>
                <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>{products.length} items listed</p>
              </div>
              <button
                className="action-btn"
                onClick={() => window.location.href = "/seller/add-product"}
                style={{ background: "#6366f1", color: "#fff", padding: "9px 18px", fontSize: 13 }}
              >
                + Add Product
              </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Title", "Brand", "Price", "Stock", "Actions"].map(h => (
                    <th key={h} style={{
                      padding: "13px 20px", textAlign: "left",
                      fontSize: 11, color: "#94a3b8", fontWeight: 600,
                      letterSpacing: "0.07em", textTransform: "uppercase",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} className="table-row" style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                    <td style={{ padding: "15px 20px", fontSize: 14, color: "#1e293b", fontWeight: 500 }}>{p.title}</td>
                    <td style={{ padding: "15px 20px", fontSize: 14, color: "#64748b" }}>{p.brand}</td>
                    <td style={{ padding: "15px 20px", fontSize: 14, color: "#1e293b", fontWeight: 600 }}>₹{p.originalPrice}</td>
                    <td style={{ padding: "15px 20px" }}>
                      <span style={{
                        background: p.stock > 10 ? "#d1fae5" : p.stock > 0 ? "#fef3c7" : "#fee2e2",
                        color: p.stock > 10 ? "#065f46" : p.stock > 0 ? "#92400e" : "#991b1b",
                        padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                      }}>{p.stock}</span>
                    </td>
                    <td style={{ padding: "15px 20px", display: "flex", gap: 8 }}>
                      <button
                        className="action-btn"
                        onClick={() => window.location.href = `/seller/edit/${p.id}`}
                        style={{ background: "#eff6ff", color: "#3b82f6", border: "1px solid #bfdbfe" }}
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => deleteProduct(p.id, p.category)}
                        style={{ background: "#fff1f2", color: "#ef4444", border: "1px solid #fecaca" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                      No products yet. Add your first product to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}