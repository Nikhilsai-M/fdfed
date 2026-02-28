import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import AdminSidebar from "../../components/admin/AdminSidebar";
Chart.register(...registerables);

export default function ProductAnalytics() {
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("Never");

  const [range, setRange] = useState(7);

  const productRef = useRef(null);
  const productChart = useRef(null);

  const [prodView, setProdView] = useState("totals");
  const [prodTotals, setProdTotals] = useState(null);
  const [brandRows, setBrandRows] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const salesRef = useRef(null);
  const salesChart = useRef(null);

  const [salesView, setSalesView] = useState("categories");
  const [categorySales, setCategorySales] = useState([]);
  const [brandSales, setBrandSales] = useState([]);
  const [salesCategory, setSalesCategory] = useState("");

  const destroyInventoryChart = () => {
    productChart.current?.destroy();
    productChart.current = null;
  };

  const destroySalesChart = () => {
    salesChart.current?.destroy();
    salesChart.current = null;
  };

  const fetchProductTotals = async () => {
    const res = await fetch("/api/admin/product-analytics/totals", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);
    setProdTotals(data.data);
    return data.data;
  };

  const fetchBrandWiseInventory = async (category) => {
    const res = await fetch(`/api/admin/product-analytics/brands/${category}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);
    const rows = data.data || [];
    setBrandRows(rows);
    return rows;
  };

  const fetchCategorySales = async (rangeDays) => {
    const res = await fetch(`/api/admin/sales-analytics/categories?range=${rangeDays}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);
    const rows = data.data || [];
    setCategorySales(rows);
    return rows;
  };

  const fetchBrandSalesByCategory = async (category, rangeDays) => {
    const res = await fetch(`/api/admin/sales-analytics/brands/${category}?range=${rangeDays}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);
    const rows = data.data || [];
    setBrandSales(rows);
    return rows;
  };

  const renderTotalsChart = (totals) => {
    if (!totals) return;
    destroyInventoryChart();

    const labels = ["Phones", "Laptops", "Chargers", "Earphones", "Mouses", "Smartwatches"];
    const keys = ["phones", "laptops", "chargers", "earphones", "mouses", "smartwatches"];
    const values = keys.map((k) => totals?.[k] || 0);

    productChart.current = new Chart(productRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "Total Products (Inventory Count)", data: values, borderWidth: 1 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: async (evt) => {
          const points = productChart.current.getElementsAtEventForMode(
            evt,
            "nearest",
            { intersect: true },
            true
          );
          if (!points.length) return;

          const idx = points[0].index;
          const categoryKey = keys[idx];

          setSelectedCategory(categoryKey);
          setProdView("brands");

          try {
            const rows = await fetchBrandWiseInventory(categoryKey);
            renderBrandInventoryChart(categoryKey, rows);
            setLastUpdated(new Date().toLocaleString());
          } catch (e) {
            setError(e.message || "Failed to load brand inventory analytics");
          }
        },
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Inventory Count by Category (Click a bar)" },
        },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    });
  };

  const renderBrandInventoryChart = (categoryKey, rows) => {
    destroyInventoryChart();

    const labels = rows.map((r) => r.brand);
    const values = rows.map((r) => r.count);

    const titleName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);

    productChart.current = new Chart(productRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "Inventory Count by Brand", data: values, borderWidth: 1 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: `Brand-wise Inventory Count: ${titleName}` },
        },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    });
  };

  const renderCategorySalesChart = (rows) => {
    destroySalesChart();

    if (!rows || rows.length === 0) return;

    const labels = rows.map((r) => r.category);
    const values = rows.map((r) => r.percent);

    salesChart.current = new Chart(salesRef.current, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{ data: values, borderWidth: 2 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: async (evt) => {
          const points = salesChart.current.getElementsAtEventForMode(
            evt,
            "nearest",
            { intersect: true },
            true
          );
          if (!points.length) return;

          const idx = points[0].index;
          const category = labels[idx];

          setSalesCategory(category);
          setSalesView("brands");

          try {
            const bRows = await fetchBrandSalesByCategory(category, range);
            renderBrandSalesChart(category, bRows);
            setLastUpdated(new Date().toLocaleString());
          } catch (e) {
            setError(e.message || "Failed to load brand sales analytics");
          }
        },
        plugins: {
          legend: { position: "right" },
          title: { display: true, text: "Category Sold % (Click a category)" },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed}%`,
            },
          },
        },
      },
    });
  };

  const renderBrandSalesChart = (category, rows) => {
    destroySalesChart();
    if (!rows || rows.length === 0) return;

    const labels = rows.map((r) => r.brand);
    const values = rows.map((r) => r.percent);

    salesChart.current = new Chart(salesRef.current, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{ data: values, borderWidth: 2 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right" },
          title: { display: true, text: `Brand Sold % in ${category}` },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed}%`,
            },
          },
        },
      },
    });
  };

  const init = async () => {
    try {
      setError("");

      setProdView("totals");
      setSelectedCategory("");
      setBrandRows([]);

      setSalesView("categories");
      setSalesCategory("");
      setBrandSales([]);

      const totals = await fetchProductTotals();
      renderTotalsChart(totals);

      const catSales = await fetchCategorySales(range);
      renderCategorySalesChart(catSales);

      setLastUpdated(new Date().toLocaleString());
    } catch (e) {
      setError(e.message || "Failed to load analytics");
    }
  };

  useEffect(() => {
    init();
    return () => {
      destroyInventoryChart();
      destroySalesChart();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setError("");
        setSalesView("categories");
        setSalesCategory("");
        setBrandSales([]);

        const catSales = await fetchCategorySales(range);
        renderCategorySalesChart(catSales);
        setLastUpdated(new Date().toLocaleString());
      } catch (e) {
        setError(e.message || "Failed to load sales analytics");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const totalInventory = prodTotals
    ? Object.values(prodTotals).reduce((a, b) => a + (Number(b) || 0), 0)
    : 0;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8">
        <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            📦 Product Analytics
          </h1>

          <div className="flex items-center gap-3">
            <select
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border bg-white text-sm shadow hover:shadow-md transition"
            >
              <option value={7}>Sales: Last 7 days</option>
              <option value={30}>Sales: Last 30 days</option>
              <option value={90}>Sales: Last 90 days</option>
            </select>

            <button
              onClick={init}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow hover:bg-indigo-700 active:scale-95 transition"
            >
              Refresh
            </button>

            {prodView === "brands" && (
              <button
                onClick={() => {
                  setProdView("totals");
                  setSelectedCategory("");
                  setBrandRows([]);
                  renderTotalsChart(prodTotals);
                }}
                className="px-4 py-2 rounded-lg bg-white border text-sm shadow hover:shadow-md transition"
              >
                ⬅ Back (Inventory)
              </button>
            )}
          </div>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
            {error}
          </div>
        )}

        <section className="bg-white rounded-2xl p-6 shadow border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              {prodView === "totals"
                ? "Inventory Count by category (click a bar to see brand-wise inventory count)."
                : `Brand-wise inventory count for: ${selectedCategory}`}
            </div>
            <div className="text-sm text-gray-500">
              Last Updated: <span className="font-medium">{lastUpdated}</span>
            </div>
          </div>

          <div className="h-[420px] rounded-xl border p-4 shadow-sm hover:shadow-md transition">
            <canvas ref={productRef} />
          </div>

          {prodTotals && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-50 p-6 rounded-xl border">
                <div className="text-gray-500 text-sm">Total Inventory Products</div>
                <div className="text-3xl font-bold mt-2">{totalInventory}</div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border">
                <div className="text-gray-500 text-sm">Most Inventory Category</div>
                <div className="text-xl font-semibold mt-2 capitalize">
                  {Object.entries(prodTotals).sort((a, b) => (b[1] || 0) - (a[1] || 0))[0]?.[0] || "-"}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border">
                <div className="text-gray-500 text-sm">Categories</div>
                <div className="text-3xl font-bold mt-2">{Object.keys(prodTotals).length}</div>
              </div>
            </div>
          )}
        </section>

        <section className="mt-8 bg-white rounded-2xl p-6 shadow border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-semibold text-indigo-700">
              💰 Sales Analytics (Sold Count %)
            </h2>

            {salesView === "brands" && (
              <button
                onClick={() => {
                  setSalesView("categories");
                  setSalesCategory("");
                  setBrandSales([]);
                  renderCategorySalesChart(categorySales);
                }}
                className="px-4 py-2 rounded-lg bg-white border text-sm shadow hover:shadow-md transition"
              >
                ⬅ Back (Sales)
              </button>
            )}
          </div>

          <div className="text-sm text-gray-600 mb-3">
            {salesView === "categories"
              ? "Category sold percentage distribution (click a category to see brand sold %)."
              : `Brand sold percentage distribution for: ${salesCategory}`}
          </div>

          <div className="h-[420px] rounded-xl border p-4 shadow-sm hover:shadow-md transition">
            <canvas ref={salesRef} />
          </div>

          {salesView === "categories" && categorySales.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              No sales found for this range.
            </div>
          )}

          {salesView === "brands" && brandSales.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              No brand sales data found for {salesCategory}.
            </div>
          )}

          {salesView === "brands" && brandSales.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow border p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-700">
                🏆 Top Selling Brands in {salesCategory}
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="py-2">Brand</th>
                    <th className="py-2">Sold</th>
                    <th className="py-2">Percent</th>
                  </tr>
                </thead>
                <tbody>
                  {brandSales.slice(0, 6).map((b, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-2 font-medium">{b.brand}</td>
                      <td className="py-2">{b.sold}</td>
                      <td className="py-2">{b.percent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}