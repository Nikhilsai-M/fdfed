import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import AdminSidebar from "../../components/admin/AdminSidebar";
Chart.register(...registerables);

export default function SupervisorAnalytics() {
  const [data, setData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("Never");
  const [listingStats, setListingStats] = useState(null);

  const barRef = useRef(null);
  const pieRef = useRef(null);
  const activityRef = useRef(null);

  const barChart = useRef(null);
  const pieChart = useRef(null);
  const activityChart = useRef(null);

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      setError("");

      // Supervisor analytics
      const supRes = await fetch("/api/admin/supervisor-analytics", {
        credentials: "include",
      });
      const supJson = await supRes.json();
      if (!supRes.ok || !supJson.success)
        throw new Error("Supervisor analytics failed");

      setData(supJson.data.supervisors);

      // Old listing activity stats
      const listRes = await fetch("/api/admin/supervisor-listings", {
        credentials: "include",
      });
      const listJson = await listRes.json();
      if (!listRes.ok || !listJson.success)
        throw new Error("Listing stats failed");

      setListingStats(listJson.statusCounts);

      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  /* ================= BAR GRAPH ================= */
  const renderBarChart = (supervisors) => {
    barChart.current?.destroy();

    barChart.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: supervisors.map((s) => s.name),
        datasets: [
          {
            label: "Listings Done",
            data: supervisors.map((s) => s.approved),
            backgroundColor: "#22c55e",
          },
          {
            label: "Listings Rejected",
            data: supervisors.map((s) => s.rejected),
            backgroundColor: "#ef4444",
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  };

  /* ================= SUPERVISOR PIE ================= */
  const renderPieChart = (supervisor) => {
    pieChart.current?.destroy();

    pieChart.current = new Chart(pieRef.current, {
      type: "pie",
      data: {
        labels: ["Accepted", "Rejected", "Pending"],
        datasets: [
          {
            data: [
              supervisor.approved,
              supervisor.rejected,
              supervisor.pending,
            ],
            backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  };

  /* ================= OLD ACTIVITY DOUGHNUT ================= */
  const renderActivityChart = (stats) => {
    activityChart.current?.destroy();

    const data = [
      stats.phone.pending || 0,
      stats.phone.approved || 0,
      stats.phone.addedToInventory || 0,
      stats.phone.rejected || 0,
      stats.laptop.pending || 0,
      stats.laptop.approved || 0,
      stats.laptop.addedToInventory || 0,
      stats.laptop.rejected || 0,
    ];

    activityChart.current = new Chart(activityRef.current, {
      type: "doughnut",
      data: {
        labels: [
          "Phone Pending",
          "Phone Approved",
          "Phone Added",
          "Phone Rejected",
          "Laptop Pending",
          "Laptop Approved",
          "Laptop Added",
          "Laptop Rejected",
        ],
        datasets: [
          {
            data,
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
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right" },
        },
      },
    });
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchData();
    return () => {
      barChart.current?.destroy();
      pieChart.current?.destroy();
      activityChart.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (data) renderBarChart(data);
  }, [data]);

  useEffect(() => {
    if (data) renderPieChart(data[selectedIndex]);
  }, [selectedIndex]);

  useEffect(() => {
    if (listingStats) renderActivityChart(listingStats);
  }, [listingStats]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          👨‍💼 Supervisor Analytics
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* BAR GRAPH */}
        <section className="bg-white rounded-2xl p-6 shadow border mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Listings Done vs Rejected
          </h2>
          <div className="h-[350px]">
            <canvas ref={barRef} />
          </div>
        </section>

        {/* SUPERVISOR PIE */}
        {data && (
          <>
            <select
              className="mb-6 px-4 py-2 border rounded-lg"
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
            >
              {data.map((s, i) => (
                <option key={i} value={i}>
                  {s.name}
                </option>
              ))}
            </select>

            <section className="bg-white rounded-2xl p-6 shadow border mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Supervisor Breakdown
              </h2>
              <div className="h-[350px]">
                <canvas ref={pieRef} />
              </div>
              <div className="mt-4 text-center font-medium">
                Total Listings: {data[selectedIndex].total}
              </div>
            </section>
          </>
        )}

        {/* OLD LISTING ACTIVITY DOUGHNUT */}
        {listingStats && (
          <section className="bg-white rounded-2xl p-6 shadow border">
            <h2 className="text-xl font-semibold mb-4">
              Overall Listings Activity
            </h2>
            <div className="h-[400px]">
              <canvas ref={activityRef} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}