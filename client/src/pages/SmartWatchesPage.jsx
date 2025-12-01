import React, { useState, useEffect } from 'react';
import SmartWatchFilter from '../components/filters/SmartWatchFilter';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Link } from 'react-router-dom';
import AddToCartButton from '../components/AddToCartButton';

const SmartWatchesPage = () => {
  const [smartwatches, setSmartwatches] = useState([]);
  const [filteredSmartwatches, setFilteredSmartwatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [filters, setFilters] = useState({
    brands: [],
    displayTypes: [],
    displaySizes: [],
    batteryRuntimes: [],
    discount: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    displayType: true,
    displaySize: true,
    batteryRuntime: true,
    discount: true,
  });

  const mainBrands = ["Apple", "Fire-Boltt", "boAt", "Samsung", "Noise"];

  // Fetch smartwatch data
  useEffect(() => {
    const fetchSmartWatchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/Accessories/smartwatches');
        if (!response.ok) throw new Error('Failed to fetch smartwatch data');

        const data = await response.json();
        setSmartwatches(data);
        setFilteredSmartwatches(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching smartwatch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSmartWatchData();
  }, []);

  // Apply Filters
  useEffect(() => {
    let filtered = [...smartwatches];

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter((w) => {
        const includesOthers = filters.brands.includes("Others");
        const includesBrand = filters.brands.includes(w.brand);
        const isOther = !mainBrands.includes(w.brand);

        if (!includesOthers) return includesBrand;
        return isOther;
      });
    }

    // Display type
    if (filters.displayTypes.length > 0) {
      filtered = filtered.filter((w) => filters.displayTypes.includes(w.displayType));
    }

    // Size
    if (filters.displaySizes.length > 0) {
      filtered = filtered.filter((w) =>
        filters.displaySizes.some((min) => parseInt(w.displaySize) >= min)
      );
    }

    // Battery runtime
    if (filters.batteryRuntimes.length > 0) {
      filtered = filtered.filter((w) =>
        filters.batteryRuntimes.some((min) => parseInt(w.batteryRuntime) >= min)
      );
    }

    // Discount
    if (filters.discount.length > 0) {
      filtered = filtered.filter((w) =>
        filters.discount.some((disc) => parseInt(w.discount) >= disc)
      );
    }

    setFilteredSmartwatches(filtered);
  }, [filters, smartwatches]);

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

  const clearAllFilters = () => {
    setFilters({
      brands: [],
      displayTypes: [],
      displaySizes: [],
      batteryRuntimes: [],
      discount: [],
    });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const calculateDiscountedPrice = (originalPrice, discount) =>
    (originalPrice - originalPrice * (discount / 100)).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Filter Sidebar */}
          <aside className="w-full lg:w-80 xl:w-1/5 lg:order-first lg:sticky lg:top-28 self-start">
            <SmartWatchFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
            />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="mb-6 mt-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Premium{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SmartWatches
                </span>
              </h2>
              <p className="text-gray-600">
                Showing {filteredSmartwatches.length} items
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin w-16 h-16 rounded-full border-b-4 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            ) : filteredSmartwatches.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <p className="text-gray-600 text-lg mb-3">No products match your filters</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSmartwatches.map((watch, index) => {
                  const discountedPrice = calculateDiscountedPrice(
                    watch.originalPrice,
                    watch.discount
                  );

                  return (
                    <div
                      key={watch.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden animate-fadeInUp hover:-translate-y-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Link to={`/smartwatch/${watch.id}`} className="block">
                        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 aspect-video">
                          <img
                            src={watch.image}
                            alt={watch.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition"
                          />
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            {watch.discount}% OFF
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="text-lg font-semibold line-clamp-2 text-gray-800 group-hover:text-blue-600 transition">
                            {watch.title}
                          </h3>

                          <div className="flex items-baseline gap-3 mt-3 mb-4">
                            <span className="text-2xl font-bold text-gray-900">
                              ₹{parseFloat(discountedPrice).toLocaleString("en-IN")}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{parseFloat(watch.originalPrice).toLocaleString("en-IN")}
                            </span>
                          </div>

                          <ul className="space-y-2 text-sm text-gray-600 border-t pt-3 mb-4">
                            <li className="flex justify-between">
                              <span className="font-semibold">Brand:</span>
                              <span>{watch.brand}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="font-semibold">Display:</span>
                              <span>{watch.displayType}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="font-semibold">Size:</span>
                              <span>{watch.displaySize}mm</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="font-semibold">Battery:</span>
                              <span>{watch.batteryRuntime} days</span>
                            </li>
                          </ul>
                        </div>
                      </Link>

                      {/* Reusable Add-to-Cart Button */}
                      <div className="px-5 pb-5">
                        <AddToCartButton product={watch} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SmartWatchesPage;
