import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import AdminSidebar from "../../components/admin/AdminSidebar";

Chart.register(...registerables);

export default function RevenueAnalytics() {
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("Never");

  const revenueRef = useRef(null);
  const revenueChart = useRef(null);

  const categoryRef = useRef(null);
  const categoryChart = useRef(null);

  const brandRef = useRef(null);
  const brandChart = useRef(null);

  const [rangeRevenue, setRangeRevenue] = useState({
    7: 0,
    30: 0,
    90: 0,
  });

  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [brandRevenue, setBrandRevenue] = useState([]);

  // Destroy charts safely
  const destroyCharts = () => {
    revenueChart.current?.destroy();
    categoryChart.current?.destroy();
    brandChart.current?.destroy();
  };

  // Fetch total revenue by range
  const fetchRevenueByRange = async (days) => {
    const res = await fetch(`/api/admin/revenue?range=${days}d`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Revenue fetch failed");
    return data.totalRevenue || 0;
  };

  // Fetch category + brand revenue
  const fetchCategoryRevenue = async () => {
    const res = await fetch(`/api/admin/revenue/categories?range=90d`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok || !data.success)
      throw new Error(data.message || "Category revenue fetch failed");

    return data;
  };

  const init = async () => {
    try {
      setError("");

      const r7 = await fetchRevenueByRange(7);
      const r30 = await fetchRevenueByRange(30);
      const r90 = await fetchRevenueByRange(90);

      const catData = await fetchCategoryRevenue();

      setRangeRevenue({
        7: r7,
        30: r30,
        90: r90,
      });

      setCategoryRevenue(catData.categoryRevenue || []);
      setBrandRevenue(catData.brandRevenue || []);

      renderRevenueChart({ 7: r7, 30: r30, 90: r90 });
      renderCategoryChart(catData.categoryRevenue || []);
      renderBrandChart(catData.brandRevenue || []);

      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError(err.message);
    }
  };

  // Line chart (7 / 30 / 90 comparison)
  const renderRevenueChart = (data) => {
    revenueChart.current?.destroy();

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
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  // Category revenue chart
  const renderCategoryChart = (rows) => {
    categoryChart.current?.destroy();

    if (!rows.length) return;

    const labels = rows
  .filter(r => r && r._id)
  .map(r => r._id);
    const values = rows
  .filter(r => r && r._id)
  .map(r => r.revenue || 0);

    categoryChart.current = new Chart(categoryRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Revenue by Category (₹)",
            data: values,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  // Brand revenue chart
  const renderBrandChart = (rows) => {
    brandChart.current?.destroy();

    if (!rows.length) return;

    const labels = rows.map((r) => r._id || "Unknown");
    const values = rows.map((r) => r.revenue);

    brandChart.current = new Chart(brandRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Revenue by Brand (₹)",
            data: values,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  useEffect(() => {
    init();
    return () => destroyCharts();
    // eslint-disable-next-line
  }, []);

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

        {/* Revenue Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border">
            <div className="text-gray-500 text-sm">Last 90 Days</div>
            <div className="text-3xl font-bold mt-2">
              ₹ {Number(rangeRevenue[90]).toLocaleString()}
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

        {/* Revenue Comparison */}
        <section className="bg-white rounded-2xl p-6 shadow border mb-8">
          <div className="h-[400px]">
            <canvas ref={revenueRef} />
          </div>
        </section>

        {/* Category Revenue */}
        <section className="bg-white rounded-2xl p-6 shadow border mb-8">
          {categoryRevenue.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              No category revenue data available.
            </div>
          ) : (
            <div className="h-[400px]">
              <canvas ref={categoryRef} />
            </div>
          )}
        </section>

        {/* Brand Revenue */}
        <section className="bg-white rounded-2xl p-6 shadow border">
          {brandRevenue.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              No brand revenue data available.
            </div>
          ) : (
            <div className="h-[400px]">
              <canvas ref={brandRef} />
            </div>
          )}
        </section>

        <div className="mt-4 text-sm text-gray-500">
          Last Updated: {lastUpdated}
        </div>
      </main>
    </div>
  );
}