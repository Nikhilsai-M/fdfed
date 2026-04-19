import React, { useState, useEffect } from "react";
import MouseFilter from "../components/filters/MouseFilter";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { Link } from "react-router-dom";
import AddToCartButton from "../components/AddToCartButton";
import { buildAssetUrl } from "../utils/api";

const MousePage = () => {
  const [mouses, setMouses] = useState([]);
  const [filteredMouses, setFilteredMouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    brands: [],
    types: [],
    connectivity: [],
    resolution: [],
    discount: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    type: true,
    connectivity: true,
    resolution: true,
    discount: true,
  });

  const mainBrands = ["Logitech", "Razer", "HP", "Dell", "Microsoft"];

  // Fetch mouse data
  useEffect(() => {
    const fetchMouseData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/Accessories/mouses");
        if (!response.ok) throw new Error("Failed to fetch mouse data");

        const data = await response.json();
        setMouses(data);
        setFilteredMouses(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching mouse data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMouseData();
  }, []);

  // Apply Filters
  useEffect(() => {
    let filtered = [...mouses];

    // Brand
    if (filters.brands.length > 0) {
      filtered = filtered.filter((m) => {
        const includesOthers = filters.brands.includes("Others");
        const includesBrand = filters.brands.includes(m.brand);
        const isOther = !mainBrands.includes(m.brand);

        return includesOthers ? isOther : includesBrand;
      });
    }

    // Type
    if (filters.types.length > 0) {
      filtered = filtered.filter((m) => filters.types.includes(m.type));
    }

    // Connectivity
    if (filters.connectivity.length > 0) {
      filtered = filtered.filter((m) =>
        filters.connectivity.includes(m.connectivity)
      );
    }

    // Resolution
    if (filters.resolution.length > 0) {
      filtered = filtered.filter((m) =>
        filters.resolution.some((r) => parseInt(m.resolution) >= r)
      );
    }

    // Discount
    if (filters.discount.length > 0) {
      filtered = filtered.filter((m) =>
        filters.discount.some((d) => parseInt(m.discount) >= d)
      );
    }

    setFilteredMouses(filtered);
  }, [filters, mouses]);

  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const current = prev[category];
      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const clearAllFilters = () =>
    setFilters({
      brands: [],
      types: [],
      connectivity: [],
      resolution: [],
      discount: [],
    });

  const toggleSection = (section) =>
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const calculateDiscountedPrice = (original, disc) =>
    (original - original * (disc / 100)).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <MouseFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
            />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Premium{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Computer Mouses
                </span>
              </h2>
              <p className="text-gray-600">
                Showing {filteredMouses.length} items
              </p>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin w-16 h-16 border-b-4 border-blue-600 rounded-full"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            ) : filteredMouses.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <p className="text-gray-600 text-lg mb-3">
                  No products match your filters
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMouses.map((mouse, index) => {
                  const discountedPrice = calculateDiscountedPrice(
                    mouse.originalPrice,
                    mouse.discount
                  );

                  return (
                    <div
                      key={mouse.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fadeInUp hover:-translate-y-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Link to={`/mouse/${mouse.id}`} className="block">
                        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 aspect-video">
                          <img
                            src={buildAssetUrl(mouse.image)}
                            alt={mouse.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition"
                          />
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                            {mouse.discount}% OFF
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600">
                            {mouse.title}
                          </h3>

                          <div className="flex items-baseline gap-3 my-3">
                            <span className="text-2xl font-bold">
                              ₹{parseFloat(discountedPrice).toLocaleString("en-IN")}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{parseFloat(mouse.originalPrice).toLocaleString("en-IN")}
                            </span>
                          </div>

                          <ul className="text-sm text-gray-600 border-t pt-3 space-y-2">
                            <li className="flex justify-between">
                              <span className="font-semibold">Brand:</span>
                              <span>{mouse.brand}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="font-semibold">Connectivity:</span>
                              <span>{mouse.connectivity}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="font-semibold">Type:</span>
                              <span>{mouse.type}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="font-semibold">Resolution:</span>
                              <span>{mouse.resolution} DPI</span>
                            </li>
                          </ul>
                        </div>
                      </Link>

                      {/*  Reusable Add to Cart Button */}
                      <div className="px-5 pb-5">
                        <AddToCartButton product={mouse} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default MousePage;
