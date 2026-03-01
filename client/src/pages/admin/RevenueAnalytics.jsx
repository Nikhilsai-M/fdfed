import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import AdminSidebar from "../../components/admin/AdminSidebar";

Chart.register(...registerables);

export default function RevenueAnalytics() {
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("Never");
  const [range, setRange] = useState(7);

  const revenueRef = useRef(null);
  const revenueChart = useRef(null);

  const categoryRef = useRef(null);
  const categoryChart = useRef(null);

  const [rangeRevenue, setRangeRevenue] = useState({
    7: 0,
    30: 0,
    90: 0,
  });

  const [categoryRevenue, setCategoryRevenue] = useState([]);

  const destroyRevenueChart = () => {
    revenueChart.current?.destroy();
    revenueChart.current = null;
  };

  const destroyCategoryChart = () => {
    categoryChart.current?.destroy();
    categoryChart.current = null;
  };

  // Fetch revenue by range
  const fetchRevenueByRange = async (days) => {
    const res = await fetch(`/api/admin/revenue?range=${days}d`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch revenue");
    return data;
  };

  const init = async () => {
    try {
      setError("");

      const r7 = await fetchRevenueByRange(7);
      const r30 = await fetchRevenueByRange(30);
      const r90 = await fetchRevenueByRange(90);

      setRangeRevenue({
        7: r7.totalRevenue || 0,
        30: r30.totalRevenue || 0,
        90: r90.totalRevenue || 0,
      });

      setCategoryRevenue(r90.revenueByCategory || []);

      renderRevenueChart({
        7: r7.totalRevenue || 0,
        30: r30.totalRevenue || 0,
        90: r90.totalRevenue || 0,
      });

      renderCategoryChart(r90.revenueByCategory || []);

      setLastUpdated(new Date().toLocaleString());
    } catch (e) {
      setError(e.message);
    }
  };

  const renderRevenueChart = (data) => {
    destroyRevenueChart();

    revenueChart.current = new Chart(revenueRef.current, {
      type: "line",
      data: {
        labels: ["Last 7 Days", "Last 30 Days", "Last 90 Days"],
        datasets: [
          {
            label: "Revenue (₹)",
            data: [data[7], data[30], data[90]],
            borderWidth: 3,
            tension: 0.4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: "Revenue Comparison" },
        },
      },
    });
  };

  const renderCategoryChart = (rows) => {
    destroyCategoryChart();

    if (!rows || rows.length === 0) return;

    const labels = rows.map((r) => r._id || "Unknown");
    const values = rows.map((r) => r.revenue);

    categoryChart.current = new Chart(categoryRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Revenue by Category (₹)",
            data: values,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: "Revenue by Category (Last 90 Days)" },
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  };

  useEffect(() => {
    init();
    return () => {
      destroyRevenueChart();
      destroyCategoryChart();
    };
    // eslint-disable-next-line
  }, []);

  const totalRevenue = rangeRevenue[90];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">
            💰 Revenue Analytics
          </h1>

          <button
            onClick={init}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Refresh
          </button>
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Total Revenue Card */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border">
            <div className="text-gray-500 text-sm">Total Revenue (90 Days)</div>
            <div className="text-3xl font-bold mt-2">
              ₹ {Number(totalRevenue).toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border">
            <div className="text-gray-500 text-sm">Last 30 Days</div>
            <div className="text-2xl font-semibold mt-2">
              ₹ {Number(rangeRevenue[30]).toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border">
            <div className="text-gray-500 text-sm">Last 7 Days</div>
            <div className="text-2xl font-semibold mt-2">
              ₹ {Number(rangeRevenue[7]).toLocaleString()}
            </div>
          </div>
        </section>

        {/* Revenue Comparison Graph */}
        <section className="bg-white rounded-2xl p-6 shadow border mb-8">
          <div className="h-[400px]">
            <canvas ref={revenueRef} />
          </div>
        </section>

        {/* Category Revenue Graph */}
        <section className="bg-white rounded-2xl p-6 shadow border">
          <div className="h-[400px]">
            <canvas ref={categoryRef} />
          </div>
        </section>

        <div className="mt-4 text-sm text-gray-500">
          Last Updated: {lastUpdated}
        </div>
      </main>
    </div>
  );
}