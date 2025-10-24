import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Check } from 'lucide-react';
import SmartWatchFilter from '../components/filters/SmartWatchFilter';

const SmartWatchesPage = () => {
  const [smartwatches, setSmartwatches] = useState([]);
  const [filteredSmartwatches, setFilteredSmartwatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItem, setCartItem] = useState(null);

  // Filter states
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
        const response = await fetch('/api/smartwatches');
        if (!response.ok) throw new Error('Failed to fetch smartwatch data');
        const data = await response.json();
        setSmartwatches(data);
        setFilteredSmartwatches(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching smartwatch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSmartWatchData();
  }, []);

  // Initialize cart count
  useEffect(() => {
    const initCart = () => {
      const session = JSON.parse(localStorage.getItem("currentSession") || '{"loggedIn": false}');
      if (session.loggedIn) {
        const userId = session.userId;
        const userCartKey = `cart_${userId}`;
        const cart = JSON.parse(localStorage.getItem(userCartKey) || '[]');
        updateCartCount(cart);
      }
    };
    initCart();
  }, []);

  // Apply filters
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...smartwatches];

      // Brand filter
      if (filters.brands.length > 0) {
        filtered = filtered.filter((smartwatch) => {
          const includesOthers = filters.brands.includes("Others");
          const includesSpecificBrand = filters.brands.includes(smartwatch.brand);
          const isOtherBrand = !mainBrands.includes(smartwatch.brand);

          if (!includesOthers) {
            return includesSpecificBrand;
          } else {
            return includesSpecificBrand || isOtherBrand;
          }
        });
      }

      // Display Type filter
      if (filters.displayTypes.length > 0) {
        filtered = filtered.filter((smartwatch) => filters.displayTypes.includes(smartwatch.display_type));
      }

      // Display Size filter
      if (filters.displaySizes.length > 0) {
        filtered = filtered.filter((smartwatch) => {
          const smartwatchSize = parseInt(smartwatch.display_size);
          return filters.displaySizes.some((size) => smartwatchSize >= size);
        });
      }

      // Battery Runtime filter
      if (filters.batteryRuntimes.length > 0) {
        filtered = filtered.filter((smartwatch) => {
          const smartwatchBattery = parseInt(smartwatch.battery_runtime);
          return filters.batteryRuntimes.some((battery) => smartwatchBattery >= battery);
        });
      }

      // Discount filter
      if (filters.discount.length > 0) {
        filtered = filtered.filter((smartwatch) => {
          const smartwatchDiscount = parseInt(smartwatch.discount);
          return filters.discount.some((disc) => smartwatchDiscount >= disc);
        });
      }

      setFilteredSmartwatches(filtered);
    };

    applyFilters();
  }, [filters, smartwatches]);

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

  const calculateDiscountedPrice = (originalPrice, discount) => {
    return (originalPrice - (originalPrice * parseFloat(discount) / 100)).toFixed(2);
  };

  const updateCartCount = (cart) => {
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      cartCountElement.textContent = totalItems;
      cartCountElement.style.display = totalItems > 0 ? "flex" : "none";
    }
  };

  const addToCart = (smartwatch) => {
    const session = JSON.parse(localStorage.getItem("currentSession") || '{"loggedIn": false}');

    if (!session.loggedIn) {
      window.location.href = "/login";
      return;
    }

    let userId = session.userId;
    let userCartKey = `cart_${userId}`;
    let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];

    const existingProductIndex = cart.findIndex((item) => item.id === smartwatch.id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({
        id: smartwatch.id,
        title: smartwatch.title,
        brand: smartwatch.brand,
        displayType: smartwatch.display_type,
        displaySize: smartwatch.display_size,
        batteryRuntime: smartwatch.battery_runtime,
        image: smartwatch.image,
        price: smartwatch.originalPrice,
        discount: parseFloat(smartwatch.discount),
        quantity: 1,
      });
    }

    localStorage.setItem(userCartKey, JSON.stringify(cart));
    updateCartCount(cart);
    setCartItem(smartwatch.title);
    setTimeout(() => setCartItem(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Cart Message */}
      {cartItem && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slideIn flex items-center gap-3">
          <Check className="w-5 h-5" />
          <span className="flex-1">{cartItem} added to cart!</span>
          <a href="/cart" className="text-white underline hover:no-underline">View Cart</a>
          <button onClick={() => setCartItem(null)} className="ml-2 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <SmartWatchFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
            />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Premium <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SmartWatches</span>
              </h2>
              <p className="text-gray-600">
                Showing {filteredSmartwatches.length} {filteredSmartwatches.length === 1 ? 'smartwatch' : 'smartwatches'}
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
                <p className="text-red-600 text-lg font-semibold mb-2">Oops! Something went wrong</p>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : filteredSmartwatches.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg mb-3">No products match your filters</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSmartwatches.map((smartwatch, index) => {
                  const discountedPrice = calculateDiscountedPrice(smartwatch.originalPrice, smartwatch.discount);
                  const discPrice = parseFloat(discountedPrice).toLocaleString('en-IN');

                  return (
                    <div
                      key={smartwatch.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fadeInUp hover:-translate-y-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <a href={`/smartwatch/${smartwatch.id}`} className="block">
                        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                          <img
                            src={smartwatch.image}
                            alt={smartwatch.title}
                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                            {smartwatch.discount} OFF
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {smartwatch.title}
                          </h3>

                          <div className="flex items-baseline gap-3 mb-4">
                            <span className="text-2xl font-bold text-gray-900">
                              ₹{discPrice}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{parseFloat(smartwatch.originalPrice).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <ul className="space-y-2 text-sm text-gray-600 border-t pt-3 mb-4">
                            <li className="flex justify-between">
                              <span className="font-semibold">Brand:</span>
                              <span>{smartwatch.brand}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="font-semibold">Display Type:</span>
                              <span>{smartwatch.display_type}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="font-semibold">Display Size:</span>
                              <span>{smartwatch.display_size}mm</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="font-semibold">Battery Runtime:</span>
                              <span>{smartwatch.battery_runtime} days</span>
                            </li>
                          </ul>
                        </div>
                      </a>

                      <div className="px-5 pb-5">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(smartwatch);
                          }}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Ensure container doesn't hide content */
        .container {
          max-width: 100%;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }

        /* Adjust sidebar to reduce left gap */
        aside {
          margin-left: 0;
          padding-left: 0;
        }

        /* Ensure scrollable content */
        body {
          overflow-y: auto;
        }

        /* Prevent header from sticking improperly */
        .min-h-screen {
          padding-top: 0;
          margin-top: 0;
        }
      `}</style>
    </div>
  );
};

export default SmartWatchesPage;