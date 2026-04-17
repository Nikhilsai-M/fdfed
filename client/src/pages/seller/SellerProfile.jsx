import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#0ea5e9", "#f59e0b", "#ef4444"];

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
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }

  .chart-card {
    background: #fff;
    border-radius: 18px;
    padding: 28px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    border: 1px solid #f1f5f9;
    animation: fadeUp 0.5s ease both;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }
  .chart-card:hover {
    box-shadow: 0 8px 32px rgba(99,102,241,0.10);
    transform: translateY(-2px);
  }

  .stat-card {
    background: #fff;
    border-radius: 14px;
    padding: 22px 24px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    border: 1px solid #f1f5f9;
    animation: fadeUp 0.45s ease both;
    transition: transform 0.18s, box-shadow 0.18s;
  }
  .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(99,102,241,0.12); }

  .back-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    color: #818cf8; font-weight: 500;
    display: flex; align-items: center; gap: 5px;
    transition: opacity 0.16s;
  }
  .back-btn:hover { opacity: 0.7; }

  .info-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #f1f5f9;
  }
  .info-row:last-child { border-bottom: none; padding-bottom: 0; }
`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1e293b", border: "none", borderRadius: 10,
        padding: "10px 16px", color: "#fff", fontSize: 13,
        fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label || payload[0].name}</p>
        <p style={{ color: "#a5b4fc" }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const ChartCard = ({ title, subtitle, icon, children, delay = 0 }) => (
  <div className="chart-card" style={{ animationDelay: `${delay}s` }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
          }}>{icon}</span>
          <h3 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            fontSize: 15, color: "#0f172a", letterSpacing: "-0.01em",
          }}>{title}</h3>
        </div>
        {subtitle && <p style={{ fontSize: 12, color: "#94a3b8", paddingLeft: 42 }}>{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

const SectionLabel = ({ icon, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
    <span style={{
      width: 28, height: 28, borderRadius: 8,
      background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
    }}>{icon}</span>
    <span style={{
      fontFamily: "'Syne', sans-serif", fontWeight: 700,
      fontSize: 15, color: "#0f172a",
    }}>{text}</span>
  </div>
);

export default function SellerProfile() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("sellerToken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(
      "http://localhost:3000/api/seller/profile-analytics",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setData(res.data.data);
  };

  if (!data) return (
    <>
      <style>{globalStyles}</style>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0f172a, #1e1b4b)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 16, fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          width: 44, height: 44,
          border: "3px solid rgba(255,255,255,0.1)",
          borderTop: "3px solid #6366f1",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading profile…</p>
      </div>
    </>
  );

  const {
    seller,
    stats,
    sellerBrandWise,
    sellerTypeWise,
    sellerRevenueTypeWise,
    siteBrandWise,
    siteTypeWise,
    
  } = data;

  const convertToChart = (obj) =>
    Object.entries(obj).map(([key, value]) => ({ name: key, value }));

  const statItems = [
    { label: "Total Products", value: stats.totalProducts, icon: "📦", color: "#6366f1", bg: "#eef2ff" },
    { label: "Total Orders", value: stats.totalOrders, icon: "🛒", color: "#0ea5e9", bg: "#e0f2fe" },
    { label: "Total Revenue", value: `₹${Number(stats.revenue)}`, icon: "💰", color: "#10b981", bg: "#d1fae5" },
  ];

  const sellerInfo = [
    { icon: "🏪", label: "Store", val: seller.storeName },
    { icon: "👤", label: "Name", val: seller.name },
    { icon: "✉️", label: "Email", val: seller.email },
    { icon: "📞", label: "Phone", val: seller.phoneNumber },
    { icon: "📍", label: "Address", val: seller.businessAddress },
  ];

  const renderLegend = (chartData) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16, justifyContent: "center" }}>
      {chartData.map((entry, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[i % COLORS.length], display: "inline-block" }} />
          {entry.name}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh", background: "#f1f3f9", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Top Bar */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          padding: "0 44px", height: 62,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button className="back-btn" onClick={() => window.location.href = "/seller/dashboard"}>
              ← Dashboard
            </button>
            <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.12)" }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: "-0.01em" }}>
              Seller Profile & Analytics
            </span>
          </div>
          <span style={{ fontSize: 12, color: "#475569" }}>{seller.storeName}</span>
        </div>

        <div style={{ padding: "36px 44px", maxWidth: 1280, margin: "0 auto" }}>

          {/* Profile + Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, marginBottom: 28 }}>

            {/* Seller Details Card */}
            <div style={{
              background: "#fff", borderRadius: 18,
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              border: "1px solid #f1f5f9", overflow: "hidden",
              animation: "fadeUp 0.4s ease both",
            }}>
              {/* Header banner */}
              <div style={{
                background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
                padding: "28px 24px 48px", position: "relative",
              }}>
                <div style={{
                  position: "absolute", top: -30, right: -30,
                  width: 100, height: 100, borderRadius: "50%",
                  background: "rgba(99,102,241,0.15)",
                }} />
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 11, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                  Seller Profile
                </p>
              </div>

              {/* Avatar */}
              <div style={{ padding: "0 24px", marginTop: -28 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, border: "3px solid #fff",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                  marginBottom: 16,
                }}>🏪</div>

                {sellerInfo.map((item, i) => (
                  <div className="info-row" key={i}>
                    <span style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                    }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize: 10, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{item.label}</p>
                      <p style={{ fontSize: 13, color: "#1e293b", fontWeight: 500, marginTop: 1 }}>{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ height: 24 }} />
            </div>

            {/* Stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {statItems.map((s, i) => (
                  <div className="stat-card" key={i} style={{ animationDelay: `${0.08 * i}s`, borderTop: `3px solid ${s.color}` }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 11,
                      background: s.bg, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, marginBottom: 14,
                    }}>{s.icon}</div>
                    <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginBottom: 6 }}>{s.label}</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: "#0f172a", letterSpacing: "-0.03em" }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Products vs Orders Pie */}
              <ChartCard title="Products vs Orders" subtitle="Overall listing vs sales ratio" icon="🥧" delay={0.12}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Products", value: stats.totalProducts },
                        { name: "Orders", value: stats.totalOrders }
                      ]}
                      dataKey="value"
                      outerRadius={80}
                      innerRadius={40}
                      paddingAngle={3}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={index} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {renderLegend([{ name: "Products" }, { name: "Orders" }])}
              </ChartCard>
            </div>
          </div>

          {/* Charts Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

            <ChartCard title="Your Sales — Brand Wise" subtitle="Units sold per brand in your store" icon="📊" delay={0.15}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={convertToChart(sellerBrandWise)} barSize={28}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: "'DM Sans'", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fontFamily: "'DM Sans'", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Your Sales — Product Type" subtitle="Units sold per category" icon="🗂️" delay={0.2}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={convertToChart(sellerTypeWise)} barSize={28}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: "'DM Sans'", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fontFamily: "'DM Sans'", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                  <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Platform Sales — Brand Wise" subtitle="All-store brand performance" icon="🌐" delay={0.25}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={convertToChart(siteBrandWise)} barSize={28}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: "'DM Sans'", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fontFamily: "'DM Sans'", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(14,165,233,0.06)" }} />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard
  title="Platform Sales — Product Type"
  subtitle="All-store category performance"
  icon="📦"
  delay={0.28}
>
  <ResponsiveContainer width="100%" height={260}>
    <BarChart data={convertToChart(siteTypeWise)} barSize={28}>
      <XAxis
        dataKey="name"
        tick={{
          fontSize: 12,
          fontFamily: "'DM Sans'",
          fill: "#94a3b8"
        }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        tick={{
          fontSize: 11,
          fontFamily: "'DM Sans'",
          fill: "#94a3b8"
        }}
        axisLine={false}
        tickLine={false}
      />
      <Tooltip
        content={<CustomTooltip />}
        cursor={{ fill: "rgba(99,102,241,0.06)" }}
      />
      <Bar
        dataKey="value"
        fill="#8b5cf6"
        radius={[6, 6, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</ChartCard>

            <ChartCard title="Your Revenue Distribution" subtitle="Revenue split by product type" icon="💸" delay={0.3}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={convertToChart(sellerRevenueTypeWise)}
                    dataKey="value"
                    outerRadius={95}
                    innerRadius={48}
                    paddingAngle={3}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={index} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {renderLegend(convertToChart(sellerRevenueTypeWise))}
            </ChartCard>

          </div>
        </div>
      </div>
    </>
  );
}