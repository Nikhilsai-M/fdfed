import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import AdminSidebar from "../../components/admin/AdminSidebar";

Chart.register(...registerables);

export default function SupervisorAnalytics() {
  const [data, setData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState(null);
  const [listingStats, setListingStats] = useState(null);
  const [topSupervisors, setTopSupervisors] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("Never");

  const barRef = useRef(null);
  const pieRef = useRef(null);
  const activityRef = useRef(null);

  const barChart = useRef(null);
  const pieChart = useRef(null);
  const activityChart = useRef(null);

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      // Supervisor analytics
      const supRes = await fetch("/api/admin/supervisor-analytics", {
        credentials: "include",
      });
      const supJson = await supRes.json();
      if (supRes.ok && supJson.success) {
        setData(supJson.data.supervisors);
        if (supJson.data.supervisors.length > 0) {
          setSelectedSupervisorId(
            supJson.data.supervisors[0].supervisor_id
          );
        }
      }

      // Overall listing stats
      const listRes = await fetch("/api/admin/supervisor-listings", {
        credentials: "include",
      });
      const listJson = await listRes.json();
      if (listRes.ok && listJson.success) {
        setListingStats(listJson.statusCounts);
      }

      // Top 5 supervisors
      const topRes = await fetch("/api/admin/top-supervisors", {
        credentials: "include",
      });
      const topJson = await topRes.json();
      if (topRes.ok && topJson.success) {
        setTopSupervisors(topJson.data);
      }

      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error("Supervisor analytics fetch error:", err);
    }
  };

  /* ================= FETCH ACTIVITY ================= */
  useEffect(() => {
    if (!selectedSupervisorId) return;

    const fetchActivity = async () => {
      try {
        const res = await fetch(
          `/api/admin/supervisor-activity/${selectedSupervisorId}`,
          { credentials: "include" }
        );
        const json = await res.json();
        if (res.ok && json.success) {
          setActivityLog(json.data);
        }
      } catch (err) {
        console.error("Activity fetch error:", err);
      }
    };

    fetchActivity();
  }, [selectedSupervisorId]);

  /* ================= BAR GRAPH ================= */
  useEffect(() => {
    if (!data || !barRef.current) return;

    barChart.current?.destroy();

    barChart.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: data.map((s) => s.name),
        datasets: [
          {
            label: "Approved",
            data: data.map((s) => s.approved),
            backgroundColor: "#22c55e",
          },
          {
            label: "Rejected",
            data: data.map((s) => s.rejected),
            backgroundColor: "#ef4444",
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }, [data]);

  /* ================= PIE GRAPH ================= */
  useEffect(() => {
    if (!data || !pieRef.current) return;

    pieChart.current?.destroy();

    const supervisor = data[selectedIndex];

    pieChart.current = new Chart(pieRef.current, {
      type: "pie",
      data: {
        labels: ["Approved", "Rejected", "Pending"],
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
  }, [selectedIndex, data]);

  /* ================= OVERALL ACTIVITY DOUGHNUT ================= */
  useEffect(() => {
    if (!listingStats || !activityRef.current) return;

    activityChart.current?.destroy();

    const stats = listingStats;

    const chartData = [
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
            data: chartData,
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
        plugins: { legend: { position: "right" } },
      },
    });
  }, [listingStats]);

  useEffect(() => {
    fetchData();
    return () => {
      barChart.current?.destroy();
      pieChart.current?.destroy();
      activityChart.current?.destroy();
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold mb-6">
          👨‍💼 Supervisor Analytics
        </h1>


        {/* BAR GRAPH */}
        {data && (
          <section className="bg-white rounded-2xl p-6 shadow border mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Listings Approved vs Rejected
            </h2>
            <div className="h-[350px]">
              <canvas ref={barRef} />
            </div>
          </section>
        )}

      

        

        {/* SELECT SUPERVISOR */}
        {data && (
          <>
            <select
              className="mb-6 px-4 py-2 border rounded-lg"
              onChange={(e) => {
                const index = Number(e.target.value);
                setSelectedIndex(index);
                setSelectedSupervisorId(data[index].supervisor_id);
              }}
            >
              {data.map((s, i) => (
                <option key={i} value={i}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* PIE */}
            <section className="bg-white rounded-2xl p-6 shadow border mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Supervisor Breakdown
              </h2>
              <div className="h-[350px]">
                <canvas ref={pieRef} />
              </div>
              <div className="mt-4 text-center font-medium">
                Total Listings: {data[selectedIndex]?.total || 0}
              </div>
            </section>
          </>
        )}

        {/* TOP 5 */}
        {topSupervisors.length > 0 && (
          <section className="bg-white rounded-2xl p-6 shadow border mb-8">
            <h2 className="text-xl font-semibold mb-4">
              🏆 Top 5 Supervisors (By Activity)
            </h2>
            <div className="space-y-3">
              {topSupervisors.map((sup, index) => (
                <div
                  key={sup.supervisor_id}
                  className="flex justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <span>{index + 1}. {sup.name}</span>
                  <span className="font-semibold text-indigo-600">
                    {sup.activityCount} Activities
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACTIVITY HISTORY */}
        {activityLog.length > 0 && (
          <section className="bg-white rounded-2xl p-6 shadow border mb-8">
            <h2 className="text-xl font-semibold mb-4">
              📜 Supervisor Activity History
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {activityLog.map((act, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 border rounded-lg"
                >
                  <div>{act.action}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(act.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* OVERALL LISTING ACTIVITY */}
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

        <div className="mt-6 text-sm text-gray-500">
          Last Updated: {lastUpdated}
        </div>
      </main>
    </div>
  );
}