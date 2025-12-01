import React, { useState, useEffect } from 'react';
import EarbudsFilter from '../components/filters/EarbudsFilter';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Link } from 'react-router-dom';
import AddToCartButton from '../components/AddToCartButton';
const EarbudsPage = () => {
  const [earbuds, setEarbuds] = useState([]);
  const [filteredEarbuds, setFilteredEarbuds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    brands: [],
    batteryLife: [],
    designs: [],
    discount: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    batteryLife: true,
    design: true,
    discount: true,
  });

  const mainBrands = ["Boat", "SAMSUNG", "Portronics", "JBL", "Noise", "realme", "Boult", "OnePlus"];

  // Fetch earbuds
  useEffect(() => {
    const fetchEarphoneData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/Accessories/earphones');
        if (!response.ok) throw new Error('Failed to fetch earphone data');

        const data = await response.json();
        setEarbuds(data);
        setFilteredEarbuds(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching earphone data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarphoneData();
  }, []);

  // Apply Filters
  useEffect(() => {
    let filtered = [...earbuds];

    if (filters.brands.length > 0) {
      filtered = filtered.filter((earbud) => {
        const includesOthers = filters.brands.includes("Others");
        const includesBrand = filters.brands.includes(earbud.brand);
        const isOther = !mainBrands.includes(earbud.brand);

        if (!includesOthers) return includesBrand;
        return isOther;
      });
    }

    // Battery life
    if (filters.batteryLife.length > 0) {
      filtered = filtered.filter((earbud) =>
        filters.batteryLife.some((min) => parseInt(earbud.batteryLife) >= min)
      );
    }

    // Design filter
    if (filters.designs.length > 0) {
      filtered = filtered.filter((earbud) => filters.designs.includes(earbud.design));
    }

    // Discount
    if (filters.discount.length > 0) {
      filtered = filtered.filter((earbud) =>
        filters.discount.some((disc) => parseInt(earbud.discount) >= disc)
      );
    }

    setFilteredEarbuds(filtered);
  }, [filters, earbuds]);

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
      batteryLife: [],
      designs: [],
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

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <EarbudsFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
            />
          </aside>

          {/* Products */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Premium{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Earbuds
                </span>
              </h2>
              <p className="text-gray-600">
                Showing {filteredEarbuds.length} items
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <p className="text-red-600 mb-2 font-semibold">Error loading data</p>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : filteredEarbuds.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <p className="text-gray-600 mb-3">No products match your filters</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEarbuds.map((earbud, index) => {
                  const discountedPrice = calculateDiscountedPrice(
                    earbud.originalPrice,
                    earbud.discount
                  );

                  return (
                    <div
                      key={earbud.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden animate-fadeInUp hover:-translate-y-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Link to={`/earphone/${earbud.id}`} className="block">
                        <div className="relative bg-gray-100 aspect-video">
                          <img
                            src={earbud.image}
                            alt={earbud.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition"
                          />
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                            {earbud.discount}% OFF
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition">
                            {earbud.title}
                          </h3>

                          <div className="flex items-baseline gap-3 mb-4">
                            <span className="text-2xl font-bold text-gray-900">
                              ₹{parseFloat(discountedPrice).toLocaleString("en-IN")}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{parseFloat(earbud.originalPrice).toLocaleString("en-IN")}
                            </span>
                          </div>

                          <ul className="space-y-2 text-sm text-gray-600 border-t pt-3 mb-4">
                            <li className="flex justify-between">
                              <span className="font-semibold">Brand:</span>
                              <span>{earbud.brand}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="font-semibold">Battery:</span>
                              <span>{earbud.batteryLife} hrs</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="font-semibold">Design:</span>
                              <span>{earbud.design}</span>
                            </li>
                          </ul>
                        </div>
                      </Link>

                      {/*  Reusable Add-to-cart button */}
                      <div className="px-5 pb-5">
                        <AddToCartButton product={earbud} />
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

export default EarbudsPage;
