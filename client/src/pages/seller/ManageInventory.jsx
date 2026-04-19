import { useEffect, useState } from "react";
import axios from "axios";
import { handleAxiosUnauthorized } from '../../utils/sessionRedirect';
import { buildApiUrl } from "../../utils/api";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .inv-row { transition: background 0.16s ease; }
  .inv-row:hover { background: #f8f7ff !important; }

  .toggle-btn {
    border: none;
    border-radius: 7px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    padding: 7px 16px;
    transition: opacity 0.16s, transform 0.14s;
    letter-spacing: 0.02em;
  }
  .toggle-btn:hover { opacity: 0.85; transform: translateY(-1px); }
  .toggle-btn:active { transform: translateY(0); }

  .stock-input {
    width: 90px;
    padding: 7px 11px;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1e293b;
    background: #f8fafc;
    transition: border-color 0.16s, box-shadow 0.16s;
    outline: none;
  }
  .stock-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
    background: #fff;
  }

  .back-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #6366f1;
    font-weight: 500;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: opacity 0.16s;
  }
  .back-btn:hover { opacity: 0.75; }
`;

const StatusBadge = ({ isActive }) => (
  <span style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    background: isActive ? "#d1fae5" : "#f1f5f9",
    color: isActive ? "#065f46" : "#64748b",
  }}>
    <span style={{
      width: 6, height: 6, borderRadius: "50%",
      background: isActive ? "#10b981" : "#94a3b8",
      display: "inline-block",
    }} />
    {isActive ? "Active" : "Inactive"}
  </span>
);

export default function ManageInventorySeller() {
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(null);
  const [seller, setSeller] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("seller")) || null;
    } catch {
      return null;
    }
  });
  const token = localStorage.getItem("sellerToken");

  useEffect(() => {
    fetchProducts();
    fetchSellerProfile();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(buildApiUrl("/api/seller/products"), {
        withCredentials: true,
      });
      setProducts(res.data.products);
    } catch (error) {
      if (handleAxiosUnauthorized(error, 'seller')) return;
      console.error(error);
    }
  };

  const fetchSellerProfile = async () => {
    try {
      const res = await axios.get(buildApiUrl("/api/seller/profile-analytics"), {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const nextSeller = res.data?.data?.seller || null;
      setSeller(nextSeller);

      if (nextSeller) {
        localStorage.setItem("seller", JSON.stringify(nextSeller));
      }
    } catch (error) {
      if (handleAxiosUnauthorized(error, 'seller')) return;
      console.error(error);
    }
  };

  const updateStock = async (id, stock, category) => {
    setSaving(id + "_stock");
    try {
      await axios.put(
        buildApiUrl(`/api/seller/products/${id}`),
        { stock, category },
        { withCredentials: true }
      );
      fetchProducts();
    } catch (error) {
      if (handleAxiosUnauthorized(error, 'seller')) return;
      console.error(error);
    } finally {
      setSaving(null);
    }
  };

  const toggleActive = async (id, isActive, category) => {
    setSaving(id + "_toggle");
    try {
      await axios.put(
        buildApiUrl(`/api/seller/products/${id}`),
        { isActive: !isActive, category },
        { withCredentials: true }
      );
      fetchProducts();
    } catch (error) {
      if (handleAxiosUnauthorized(error, 'seller')) return;
      console.error(error);
    } finally {
      setSaving(null);
    }
  };

  const activeCount = products.filter(p => p.isActive).length;
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh", background: "#f1f3f9", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Top Bar */}
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
            <button className="back-btn" onClick={() => window.location.href = "/seller/dashboard"} style={{ color: "#818cf8" }}>
              ← Dashboard
            </button>
            <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.12)" }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: "-0.01em" }}>
              Manage Inventory
            </span>
          </div>
          <span style={{ fontSize: 12, color: "#64748b", letterSpacing: "0.04em" }}>
            {products.length} total products
          </span>
        </div>

        <div style={{ padding: "36px 44px" }}>

          {seller && (
            <div
              style={{
                marginBottom: 24,
                background: "linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: "20px 24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                animation: "fadeUp 0.4s ease both",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontSize: 12, color: "#6366f1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                    Seller Inventory
                  </p>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 21, color: "#0f172a", margin: 0 }}>
                    {seller.storeName || "Seller Store"}
                  </h2>
                  <p style={{ color: "#475569", fontSize: 14, marginTop: 6 }}>
                    {seller.name || "Seller"} · {seller.email || "No email"}
                  </p>
                </div>
                <div style={{ minWidth: 220 }}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
                    <strong style={{ color: "#0f172a" }}>Phone:</strong> {seller.phoneNumber || "N/A"}
                  </p>
                  <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13 }}>
                    <strong style={{ color: "#0f172a" }}>Address:</strong> {seller.businessAddress || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Summary Pills */}
          <div style={{ display: "flex", gap: 14, marginBottom: 32, animation: "fadeUp 0.4s ease both" }}>
            {[
              { label: "Total Listed", val: products.length, color: "#6366f1", bg: "#eef2ff" },
              { label: "Active", val: activeCount, color: "#10b981", bg: "#d1fae5" },
              { label: "Low Stock (≤5)", val: lowStockCount, color: "#f59e0b", bg: "#fef3c7" },
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
                  width: 36, height: 36, borderRadius: 9, background: s.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, color: s.color,
                }}>{s.val}</span>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
            overflow: "hidden",
            animation: "fadeUp 0.5s 0.1s ease both",
            opacity: 0,
            animationFillMode: "forwards",
          }}>
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #f1f5f9" }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a" }}>Product Inventory</h2>
              <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>Update stock quantities and toggle product visibility</p>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["#", "Title", "Current Stock", "Status", "Action"].map(h => (
                    <th key={h} style={{
                      padding: "12px 20px", textAlign: "left",
                      fontSize: 11, color: "#94a3b8", fontWeight: 600,
                      letterSpacing: "0.07em", textTransform: "uppercase",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} className="inv-row" style={{
                    borderBottom: "1px solid #f1f5f9",
                    background: i % 2 === 0 ? "#fff" : "#fafbfc",
                  }}>
                    <td style={{ padding: "16px 20px", color: "#cbd5e1", fontSize: 13, fontWeight: 600 }}>
                      {String(i + 1).padStart(2, "0")}
                    </td>

                    <td style={{ padding: "16px 20px" }}>
                      <p style={{ fontSize: 14, color: "#1e293b", fontWeight: 500 }}>{p.title}</p>
                      {p.brand && <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{p.brand}</p>}
                    </td>

                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input
                          type="number"
                          className="stock-input"
                          defaultValue={p.stock}
                          onBlur={(e) => updateStock(p.id, e.target.value, p.category)}
                        />
                        {saving === p.id + "_stock" && (
                          <span style={{ fontSize: 11, color: "#10b981", fontWeight: 500 }}>Saving…</span>
                        )}
                        {p.stock <= 5 && p.stock > 0 && (
                          <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600, background: "#fef3c7", padding: "2px 8px", borderRadius: 10 }}>Low</span>
                        )}
                        {p.stock === 0 && (
                          <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, background: "#fee2e2", padding: "2px 8px", borderRadius: 10 }}>Out</span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: "16px 20px" }}>
                      <StatusBadge isActive={p.isActive} />
                    </td>

                    <td style={{ padding: "16px 20px" }}>
                      <button
                        className="toggle-btn"
                        onClick={() => toggleActive(p.id, p.isActive, p.category)}
                        disabled={saving === p.id + "_toggle"}
                        style={{
                          background: p.isActive ? "#fff1f2" : "#eff6ff",
                          color: p.isActive ? "#ef4444" : "#3b82f6",
                          border: p.isActive ? "1.5px solid #fecaca" : "1.5px solid #bfdbfe",
                          opacity: saving === p.id + "_toggle" ? 0.6 : 1,
                        }}
                      >
                        {saving === p.id + "_toggle" ? "…" : p.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: "52px 20px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                      No products found in inventory.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
