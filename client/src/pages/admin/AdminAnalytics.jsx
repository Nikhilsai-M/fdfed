
import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import AdminSidebar from "../../components/admin/AdminSidebar";

Chart.register(...registerables);

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("Never");

  const [categoryChart, setCategoryChart] = useState(null);
  const [statusChart, setStatusChart] = useState(null);


  const fetchStatistics = async () => {
    try {
      const response = await fetch("/api/admin/statistics", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (data.success) {
        setStats(data.statistics);
        setLastUpdated(new Date().toLocaleString());
        renderCharts(data.statistics);
      } else {
        alert("Failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      alert("Failed to load statistics");
    }
  };

  const renderCharts = (stats) => {
    const categoryData = stats.salesByCategory || {};
    const statusData = stats.applicationStatus || { phone: {}, laptop: {} };


    const categoryCtx = document.getElementById("categoryChart")?.getContext("2d");
    if (categoryChart) categoryChart.destroy();
    const newCategoryChart = new Chart(categoryCtx, {
      type: "bar",
      data: {
        labels: ["Phones", "Laptops", "Chargers", "Earphones", "Mouses", "Smartwatches"],
        datasets: [
          {
            label: "Inventory Count",
            data: [
              categoryData.phones || 0,
              categoryData.laptops || 0,
              categoryData.chargers || 0,
              categoryData.earphones || 0,
              categoryData.mouses || 0,
              categoryData.smartwatches || 0,
            ],
            backgroundColor: "rgba(16, 185, 129, 0.6)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Count" } },
        },
        plugins: { legend: { display: false } },
      },
    });
    setCategoryChart(newCategoryChart);

    const statusCtx = document.getElementById("statusChart")?.getContext("2d");
    if (statusChart) statusChart.destroy();
    const newStatusChart = new Chart(statusCtx, {
      type: "doughnut",
      data: {
        labels: [
          "Phone Pending",
          "Phone Approved",
          "Phone Rejected",
          "Laptop Pending",
          "Laptop Approved",
          "Laptop Rejected",
        ],
        datasets: [
          {
            data: [
              statusData.phone.pending || 0,
              statusData.phone.approved || 0,
              statusData.phone.rejected || 0,
              statusData.laptop.pending || 0,
              statusData.laptop.approved || 0,
              statusData.laptop.rejected || 0,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "right" } },
      },
    });
    setStatusChart(newStatusChart);
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = "/admin/login";
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      alert("Error during logout");
    }
  };

  const updateTrendIndicator = (trend) => {
    if (trend > 0) return `+${trend}% ↑`;
    if (trend < 0) return `${trend}% ↓`;
    return "No Change";
  };

  return (
   <div className="min-h-screen flex bg-gray-100 text-gray-800">
  
  <div className="min-h-screen flex bg-gray-100 text-gray-800">
  <AdminSidebar /> 

  {/* Main Content */}
  <main className="flex-1 p-8 overflow-y-auto">
    ...
  </main>
</div>


   
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📊 Admin Analytics Dashboard</h1>
        </header>

     
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats ? (
            <>
              <StatsCard title="INVENTORY ITEMS COUNT" value={stats.totalSales || 0} trend={stats.trends?.totalSales} />
              <StatsCard title="TOTAL LISTINGS" value={stats.totalListings || 0} trend={stats.trends?.totalListings} />
              <StatsCard title="APPROVED LISTINGS" value={stats.approvedListings || 0} trend={stats.trends?.approvedListings} />
              <StatsCard
                title="SALES REVENUE"
                value={`₹ ${Number(stats.totalSalesRevenue || 0).toLocaleString("en-IN")}`}
                trend={stats.trends?.totalSalesRevenue}
              />
            </>
          ) : (
            <p>Loading stats...</p>
          )}
        </div>

   
        <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Analytics Overview</h2>
          <div className="flex flex-wrap gap-8 justify-between">
            <div className="flex-1 min-w-[300px] h-[300px]">
              <canvas id="categoryChart"></canvas>
            </div>
            <div className="flex-1 min-w-[300px] h-[300px]">
              <canvas id="statusChart"></canvas>
            </div>
          </div>
        </section>


        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={fetchStatistics}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Refresh Statistics
          </button>
          <p className="text-gray-600 text-sm">
            Last Updated: <span className="font-medium">{lastUpdated}</span>
          </p>
        </div>
      </main>
    </div>
  );
};


const StatsCard = ({ title, value, trend }) => (
  <div className="bg-white rounded-lg p-6 shadow hover:scale-[1.02] transition-transform duration-200">
    <div className="text-gray-500 text-sm font-semibold">{title}</div>
    <div className="text-2xl font-bold text-gray-900 my-2">{value}</div>
    <div
      className={`text-sm font-medium ${
        trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-400"
      }`}
    >
      {trend > 0 ? `+${trend}% ↑` : trend < 0 ? `${trend}% ↓` : "No Change"}
    </div>
  </div>
);

export default AdminAnalytics;
