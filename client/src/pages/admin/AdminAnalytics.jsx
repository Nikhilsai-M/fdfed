import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import AdminSidebar from "../../components/admin/AdminSidebar";
Chart.register(...registerables);

const fmtINR = (n) => new Intl.NumberFormat("en-IN").format(Math.round(n || 0));

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("Never");
  const [range, setRange] = useState(7);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [error, setError] = useState("");
  const [supervisorListings, setSupervisorListings] = useState(null);

  const categoryRef = useRef(null);
  const statusRef = useRef(null);
  const categoryChart = useRef(null);
  const statusChart = useRef(null);
  const timerRef = useRef(null);

  const fetchSupervisorListings = async (rangeDays = 7) => {
    try {
      const res = await fetch(`/api/admin/supervisor-listings?range=${rangeDays}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        console.warn("Failed to fetch supervisor listings:", data.message || `HTTP ${res.status}`);
        return null;
      }

      
      const statusCounts = data.statusCounts || {
        phone: { pending: 0, approved: 0, addedToInventory: 0, rejected: 0 },
        laptop: { pending: 0, approved: 0, addedToInventory: 0, rejected: 0 },
      };

      const result = {
        statusCounts,
        totalAddedToInventory: data.totalAddedToInventory || 0,
        trendAddedToInventory: data.trendAddedToInventory ?? 0
      };
      
      setSupervisorListings(result);
      return result;
    } catch (err) {
      console.error("Error fetching supervisor listings:", err);
      return null;
    }
  };

  const fetchStatistics = async () => {
    try {
      setError("");
      const res = await fetch(`/api/admin/statistics?range=${range}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || `HTTP ${res.status}`);

      setStats(data.statistics);
      setLastUpdated(new Date().toLocaleString());
      
      
      console.log("📊 Admin Statistics Data:", {
        salesByCategory: data.statistics.salesByCategory,
        phones: data.statistics.salesByCategory?.phones,
        laptops: data.statistics.salesByCategory?.laptops
      });
      
    
      const supervisorData = await fetchSupervisorListings(range);
      renderCharts(data.statistics, supervisorData?.statusCounts || null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load statistics");
    }
  };

  const renderCharts = (s, supervisorData = null) => {
    
    categoryChart.current?.destroy();
    statusChart.current?.destroy();


    categoryChart.current = new Chart(categoryRef.current, {
      type: "bar",
      data: {
        labels: [
          "Phones",
          "Laptops",
          "Chargers",
          "Earphones",
          "Mouses",
          "Smartwatches",
        ],
        datasets: [
          {
            label: "Inventory Count",
            data: [
              s.salesByCategory?.phones || 0,
              s.salesByCategory?.laptops || 0,
              s.salesByCategory?.chargers || 0,
              s.salesByCategory?.earphones || 0,
              s.salesByCategory?.mouses || 0,
              s.salesByCategory?.smartwatches || 0,
            ],
            backgroundColor: "rgba(99, 102, 241, 0.25)",
            borderColor: "rgba(99, 102, 241, 1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(99, 102, 241, 0.5)",
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 650, easing: "easeOutQuart" },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Count" } },
          x: { title: { display: true, text: "Category" } },
        },
        plugins: { legend: { display: false } },
      },
    });

    
    
    const statusData = supervisorData || {
      phone: { pending: 0, approved: 0, addedToInventory: 0, rejected: 0 },
      laptop: { pending: 0, approved: 0, addedToInventory: 0, rejected: 0 },
    };

    const doughnutData = {
      labels: [
        "Phone Pending",
        "Phone Approved",
        "Phone Added to Inventory",
        "Phone Rejected",
        "Laptop Pending",
        "Laptop Approved",
        "Laptop Added to Inventory",
        "Laptop Rejected",
      ],
      datasets: [
        {
          data: [
            statusData.phone.pending || 0,
            statusData.phone.approved || 0,
            statusData.phone.addedToInventory || 0,
            statusData.phone.rejected || 0,
            statusData.laptop.pending || 0,
            statusData.laptop.approved || 0,
            statusData.laptop.addedToInventory || 0,
            statusData.laptop.rejected || 0,
          ],
          backgroundColor: [
            "#ef4444", 
            "#22c55e", 
            "#10b981", 
            "#eab308", 
            "#3b82f6",
            "#a855f7", 
            "#06b6d4", 
            "#f97316", 
          ],
          borderWidth: 2,
          hoverOffset: 15,
        },
      ],
    };

    statusChart.current = new Chart(statusRef.current, {
      type: "doughnut",
      data: doughnutData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right", labels: { boxWidth: 20 } },
          title: { display: false },
        },
      },
    });
  };

  
  useEffect(() => {
    fetchStatistics();
    if (autoRefresh) {
      timerRef.current = setInterval(fetchStatistics, 15000);
    }
    return () => clearInterval(timerRef.current);
  }, [range, autoRefresh]);

 
  useEffect(() => {
    return () => {
      categoryChart.current?.destroy();
      statusChart.current?.destroy();
    };
  }, []);

  const exportCSV = () => {
    if (!stats) return;
    const rows = [
      ["Metric", "Value"],
      ["Total Sales (orders)", stats.totalSales],
      ["Total Listings", stats.totalListings],
      ["Approved Listings", stats.approvedListings],
      ["Sales Revenue (INR)", stats.totalSalesRevenue],
      ["Phones", stats.salesByCategory?.phones || 0],
      ["Laptops", stats.salesByCategory?.laptops || 0],
      ["Chargers", stats.salesByCategory?.chargers || 0],
      ["Earphones", stats.salesByCategory?.earphones || 0],
      ["Mouses", stats.salesByCategory?.mouses || 0],
      ["Smartwatches", stats.salesByCategory?.smartwatches || 0],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const Card = ({ title, value, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition-shadow duration-200 border border-gray-100 hover:scale-[1.01] transform">
      <div className="text-xs tracking-wider text-gray-500 font-semibold">
        {title}
      </div>
      <div className="text-3xl font-extrabold text-gray-900 mt-2">
        {typeof value === "number" ? fmtINR(value) : value}
      </div>
      <div
        className={`mt-2 text-sm font-medium ${
          trend > 0
            ? "text-emerald-600"
            : trend < 0
            ? "text-rose-600"
            : "text-gray-400"
        }`}
      >
        {trend > 0
          ? `+${trend}% ↑`
          : trend < 0
          ? `${trend}% ↓`
          : "No Change"}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8">
        <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            📈 Admin Analytics Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <select
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border bg-white text-sm shadow hover:shadow-md transition"
              title="Time range"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>

            <button
              onClick={fetchStatistics}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow hover:bg-indigo-700 active:scale-95 transition"
            >
              Refresh
            </button>

            <button
              onClick={exportCSV}
              className="px-4 py-2 rounded-lg bg-white border text-sm shadow hover:shadow-md transition"
            >
              Export CSV
            </button>

            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="accent-indigo-600"
              />
              Auto-refresh
            </label>
          </div>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
            {error}
          </div>
        )}

     
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
          <Card
            title="INVENTORY ITEMS COUNT"
            value={
              (stats?.salesByCategory?.phones || 0) +
              (stats?.salesByCategory?.laptops || 0) +
              (stats?.salesByCategory?.chargers || 0) +
              (stats?.salesByCategory?.earphones || 0) +
              (stats?.salesByCategory?.mouses || 0) +
              (stats?.salesByCategory?.smartwatches || 0)
            }
            trend={stats?.trends?.totalListings ?? 0}
          />
          <Card
            title="TOTAL LISTINGS"
            value={stats?.totalListings ?? 0}
            trend={stats?.trends?.totalListings ?? 0}
          />
          <Card
            title="APPROVED LISTINGS"
            value={stats?.approvedListings ?? 0}
            trend={stats?.trends?.approvedListings ?? 0}
          />
          <Card
            title="ITEMS ADDED TO INVENTORY"
            value={supervisorListings?.totalAddedToInventory ?? 0}
            trend={supervisorListings?.trendAddedToInventory ?? 0}
          />
          <Card
            title="SALES REVENUE"
            value={`₹ ${fmtINR(stats?.totalSalesRevenue || 0)}`}
            trend={stats?.trends?.totalSalesRevenue ?? 0}
          />
        </div>

     
        <section className="bg-white rounded-2xl p-6 shadow border border-gray-100 mb-8">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            Analytics Overview
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-[340px] rounded-xl border p-4 shadow-sm hover:shadow-md transition">
              <canvas ref={categoryRef} />
            </div>
            <div className="h-[340px] rounded-xl border p-4 shadow-sm hover:shadow-md transition">
              <canvas ref={statusRef} />
            </div>
          </div>
        </section>

        <div className="text-right text-gray-500 text-sm">
          Last Updated: <span className="font-medium">{lastUpdated}</span>
        </div>
      </main>
    </div>
  );
}
