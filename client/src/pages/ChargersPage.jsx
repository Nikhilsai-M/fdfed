import React, { useState, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import ChargerFilter from '../components/filters/ChargerFilter';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

// ⭐ NEW REUSABLE CART BUTTON
import AddToCartButton from '../components/AddToCartButton';

const ChargersPage = () => {
  const [chargers, setChargers] = useState([]);
  const [filteredChargers, setFilteredChargers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    brands: [],
    wattages: [],
    types: [],
    outputCurrents: [],
    discount: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    wattage: true,
    type: true,
    outputCurrents: true,
    discount: true,
  });

  const mainBrands = ["Apple", "Samsung", "RoarX", "Pacificdeals", "EYNK"];
  const navigate = useNavigate();

  // Fetch charger data
  useEffect(() => {
    const fetchChargerData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/Accessories/chargers');
        if (!response.ok) throw new Error('Failed to fetch charger data');

        const data = await response.json();
        setChargers(data);
        setFilteredChargers(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching charger data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChargerData();
  }, []);

  // Apply filters
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...chargers];

      if (filters.brands.length > 0) {
        filtered = filtered.filter((charger) => {
          const includesOthers = filters.brands.includes("Others");
          const includesSpecificBrand = filters.brands.includes(charger.brand);
          const isOtherBrand = !mainBrands.includes(charger.brand);

          if (!includesOthers) return includesSpecificBrand;
          return isOtherBrand;
        });
      }

      if (filters.wattages.length > 0) {
        filtered = filtered.filter((charger) =>
          filters.wattages.includes(charger.wattage)
        );
      }

      if (filters.types.length > 0) {
        filtered = filtered.filter((charger) =>
          filters.types.includes(charger.type)
        );
      }

      if (filters.outputCurrents.length > 0) {
        filtered = filtered.filter((charger) =>
          filters.outputCurrents.includes(charger.outputCurrent)
        );
      }

      if (filters.discount.length > 0) {
        filtered = filtered.filter((charger) => {
          const chargerDiscount = parseInt(charger.discount);
          return filters.discount.some((disc) => chargerDiscount >= disc);
        });
      }

      setFilteredChargers(filtered);
    };

    applyFilters();
  }, [filters, chargers]);

  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const current = prev[category];
      const newValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      return { ...prev, [category]: newValues };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      brands: [],
      wattages: [],
      types: [],
      outputCurrents: [],
      discount: [],
    });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const calculateDiscountedPrice = (originalPrice, discount) => {
    return originalPrice - (originalPrice * parseFloat(discount) / 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 xl:w-1/5 lg:sticky lg:top-28 self-start">
            <ChargerFilter
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
                Premium{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Chargers
                </span>
              </h2>
              <p className="text-gray-600">
                Showing {filteredChargers.length}{' '}
                {filteredChargers.length === 1 ? 'charger' : 'chargers'}
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                  <X className="w-12 h-12 text-red-600" />
                </div>
                <p className="text-red-600 text-lg font-semibold mb-2">
                  Oops! Something went wrong
                </p>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : filteredChargers.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <p className="text-gray-600 text-lg mb-3">
                  No products match your filters
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChargers.map((charger, index) => {
                  const discountedPrice = calculateDiscountedPrice(
                    charger.originalPrice,
                    charger.discount
                  );

                  return (
                    <div
                      key={charger.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fadeInUp hover:-translate-y-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Link to={`/charger/${charger.id}`} className="block">
                        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-video">
                          <img
                            src={charger.image}
                            alt={charger.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                            {charger.discount}% OFF
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {charger.title}
                          </h3>

                          <div className="flex items-baseline gap-3 mb-4">
                            <span className="text-2xl font-bold text-gray-900">
                              ₹{discountedPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{charger.originalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <ul className="space-y-2 text-sm text-gray-600 border-t pt-3 mb-4">
                            <li className="flex justify-between"><span className="font-semibold">Brand:</span> {charger.brand}</li>
                            <li className="flex justify-between"><span className="font-semibold">Type:</span> {charger.type}</li>
                            <li className="flex justify-between"><span className="font-semibold">Wattage:</span> {charger.wattage}W</li>
                            <li className="flex justify-between"><span className="font-semibold">Output Current:</span> {charger.outputCurrent}</li>
                          </ul>
                        </div>
                      </Link>

                      <div className="px-5 pb-5">
                        {/* Reusable AddToCart Button */}
                        <AddToCartButton product={charger} />
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

export default ChargersPage;
