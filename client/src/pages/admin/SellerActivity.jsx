import React, { useEffect, useMemo, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import AdminSidebar from "../../components/admin/AdminSidebar";

Chart.register(...registerables);

const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.round(Number(n || 0))
  );

const toISODate = (d) => new Date(d).toISOString().slice(0, 10);

export default function SellerActivity() {
  const [range, setRange] = useState(30);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [top, setTop] = useState([]); // [{sellerName, itemsSold, revenue}]
  const [trend, setTrend] = useState([]); // raw trend rows

  const itemsChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const trendChartRef = useRef(null);

  const itemsChart = useRef(null);
  const revenueChart = useRef(null);
  const trendChart = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErr("");

      const [topRes, trendRes] = await Promise.all([
        fetch(`/api/admin/seller-activity/top?range=${range}&limit=${limit}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
        fetch(`/api/admin/seller-activity/trend?range=${range}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      const topJson = await topRes.json();
      const trendJson = await trendRes.json();

      if (!topRes.ok || !topJson?.success) {
        throw new Error(topJson?.message || "Failed to load top sellers");
      }
      if (!trendRes.ok || !trendJson?.success) {
        throw new Error(trendJson?.message || "Failed to load seller trend");
      }

      setTop(Array.isArray(topJson.data) ? topJson.data : []);
      setTrend(Array.isArray(trendJson.trend) ? trendJson.trend : []);
    } catch (e) {
      setErr(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, limit]);

  // ---------- Derived data ----------
  const kpis = useMemo(() => {
    const totalItems = top.reduce((s, r) => s + Number(r.itemsSold || 0), 0);
    const totalRevenue = top.reduce((s, r) => s + Number(r.revenue || 0), 0);
    const topSeller = top?.[0]?.sellerName || "—";
    return { totalItems, totalRevenue, topSeller };
  }, [top]);

  const trendPrepared = useMemo(() => {
    // trend rows: { _id: { date, seller }, items, revenue }
    // Build daily labels within range, and pick top 3 sellers based on total items in trend
    const bySeller = new Map(); // sellerId -> { totals, byDate }
    for (const row of trend) {
      const sellerId = row?._id?.seller;
      const date = row?._id?.date;
      if (!sellerId || !date) continue;

      const items = Number(row.items || 0);
      const revenue = Number(row.revenue || 0);

      if (!bySeller.has(sellerId)) {
        bySeller.set(sellerId, { totalItems: 0, totalRevenue: 0, byDate: new Map() });
      }
      const s = bySeller.get(sellerId);
      s.totalItems += items;
      s.totalRevenue += revenue;
      s.byDate.set(date, { items, revenue });
    }

    // Determine top 3 sellers by items in trend
    const sellerIdsSorted = Array.from(bySeller.entries())
      .sort((a, b) => b[1].totalItems - a[1].totalItems)
      .slice(0, 3)
      .map(([id]) => id);

    // Build labels covering the range days (daily)
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - Number(range || 30));

    const labels = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      labels.push(toISODate(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    // Map sellerId -> sellerName using "top" list (fallback to id)
    const sellerNameMap = new Map();
    for (const t of top) {
      if (t && t._id) sellerNameMap.set(String(t._id), t.sellerName);
    }
    // Note: your backend top API doesn't return _id in project currently.
    // We'll instead build name map by matching order: if sellerName exists, use that in legend for bar charts.
    // For trend legend, we'll show "Seller 1/2/3" if name not available.

    const series = sellerIdsSorted.map((sellerId, idx) => {
      const s = bySeller.get(sellerId);
      const dataItems = labels.map((d) => Number(s.byDate.get(d)?.items || 0));
      const dataRevenue = labels.map((d) => Number(s.byDate.get(d)?.revenue || 0));
      return {
        sellerId: String(sellerId),
        sellerName: sellerNameMap.get(String(sellerId)) || `Top Seller ${idx + 1}`,
        items: dataItems,
        revenue: dataRevenue,
      };
    });

    return { labels, series };
  }, [trend, range, top]);

  // ---------- Charts ----------
  useEffect(() => {
    // cleanup previous charts
    if (itemsChart.current) itemsChart.current.destroy();
    if (revenueChart.current) revenueChart.current.destroy();
    if (trendChart.current) trendChart.current.destroy();

    if (!itemsChartRef.current || !revenueChartRef.current || !trendChartRef.current) return;
    if (loading) return;

    // Bar: Items Sold
    const sellerLabels = top.map((r) => r.sellerName || "Unknown");
    const itemsData = top.map((r) => Number(r.itemsSold || 0));
    itemsChart.current = new Chart(itemsChartRef.current, {
      type: "bar",
      data: {
        labels: sellerLabels,
        datasets: [{ label: "Items Sold", data: itemsData }],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${fmtINR(ctx.raw)}`,
            },
          },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    // Bar: Revenue
    const revenueData = top.map((r) => Number(r.revenue || 0));
    revenueChart.current = new Chart(revenueChartRef.current, {
      type: "bar",
      data: {
        labels: sellerLabels,
        datasets: [{ label: "Revenue (₹)", data: revenueData }],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ₹${fmtINR(ctx.raw)}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (v) => `₹${fmtINR(v)}`,
            },
          },
        },
      },
    });

    // Line: Trend for top 3 sellers (Items)
    const { labels, series } = trendPrepared;
    trendChart.current = new Chart(trendChartRef.current, {
      type: "line",
      data: {
        labels,
        datasets: series.map((s) => ({
          label: `${s.sellerName} (Items)`,
          data: s.items,
          tension: 0.3,
          pointRadius: 0,
        })),
      },
      options: {
        responsive: true,
        interaction: { mode: "index", intersect: false },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${fmtINR(ctx.raw)}`,
            },
          },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => {
      if (itemsChart.current) itemsChart.current.destroy();
      if (revenueChart.current) revenueChart.current.destroy();
      if (trendChart.current) trendChart.current.destroy();
    };
  }, [top, loading, trendPrepared]);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0 }}>Seller Activity</h2>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <label>
              Range:&nbsp;
              <select value={range} onChange={(e) => setRange(Number(e.target.value))}>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </label>

            <label>
              Top:&nbsp;
              <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={20}>Top 20</option>
              </select>
            </label>

            <button onClick={fetchData} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>

        {err ? (
          <div style={{ marginTop: 12, padding: 12, background: "#ffe5e5", borderRadius: 8 }}>
            {err}
          </div>
        ) : null}

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 }}>
          <div style={{ padding: 14, border: "1px solid #ddd", borderRadius: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Top Seller</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{kpis.topSeller}</div>
          </div>
          <div style={{ padding: 14, border: "1px solid #ddd", borderRadius: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Total Items (Top List)</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{fmtINR(kpis.totalItems)}</div>
          </div>
          <div style={{ padding: 14, border: "1px solid #ddd", borderRadius: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Total Revenue (Top List)</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>₹{fmtINR(kpis.totalRevenue)}</div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
          <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 10 }}>
            <h3 style={{ marginTop: 0 }}>Items Sold by Seller</h3>
            <canvas ref={itemsChartRef} />
          </div>

          <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 10 }}>
            <h3 style={{ marginTop: 0 }}>Revenue by Seller</h3>
            <canvas ref={revenueChartRef} />
          </div>
        </div>

        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 10, marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Growth Trend (Top Sellers)</h3>
          <canvas ref={trendChartRef} />
        </div>

        {/* Table */}
        <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 10 }}>
          <h3 style={{ marginTop: 0 }}>Top Sellers Summary</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #ddd" }}>Seller</th>
                  <th style={{ textAlign: "right", padding: 10, borderBottom: "1px solid #ddd" }}>Items Sold</th>
                  <th style={{ textAlign: "right", padding: 10, borderBottom: "1px solid #ddd" }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {top.map((r, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: 10, borderBottom: "1px solid #f0f0f0" }}>
                      {r.sellerName || "Unknown"}
                    </td>
                    <td style={{ padding: 10, borderBottom: "1px solid #f0f0f0", textAlign: "right" }}>
                      {fmtINR(r.itemsSold)}
                    </td>
                    <td style={{ padding: 10, borderBottom: "1px solid #f0f0f0", textAlign: "right" }}>
                      ₹{fmtINR(r.revenue)}
                    </td>
                  </tr>
                ))}
                {!top.length && !loading ? (
                  <tr>
                    <td colSpan={3} style={{ padding: 10, textAlign: "center", opacity: 0.7 }}>
                      No data for this range
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        {loading ? <div style={{ marginTop: 12, opacity: 0.7 }}>Loading...</div> : null}
      </div>
    </div>
  );
}