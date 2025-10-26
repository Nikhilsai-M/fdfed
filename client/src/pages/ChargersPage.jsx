import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Check } from 'lucide-react';
import ChargerFilter from '../components/filters/ChargerFilter';
import { Link } from 'react-router-dom';
const ChargersPage = () => {
  const [chargers, setChargers] = useState([]);
  const [filteredChargers, setFilteredChargers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItem, setCartItem] = useState(null);

  // Filter states
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
      let filtered = [...chargers];

      // Brand filter
      if (filters.brands.length > 0) {
        filtered = filtered.filter((charger) => {
          const includesOthers = filters.brands.includes("Others");
          const includesSpecificBrand = filters.brands.includes(charger.brand);
          const isOtherBrand = !mainBrands.includes(charger.brand);

          if (!includesOthers) {
            return includesSpecificBrand;
          } else {
            return isOtherBrand;
          }
        });
      }

      // Wattage filter
      if (filters.wattages.length > 0) {
        filtered = filtered.filter((charger) => filters.wattages.includes(charger.wattage));
      }

      // Type filter
      if (filters.types.length > 0) {
        filtered = filtered.filter((charger) => filters.types.includes(charger.type));
      }

      // ✅ Output Current filter
      if (filters.outputCurrents.length > 0) {
        filtered = filtered.filter((charger) =>
          filters.outputCurrents.includes(charger.outputCurrent)
        );
      }

      // Discount filter
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
      outputCurrents: [], // ✅ Reset added
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

  const updateCartCount = (cart) => {
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      cartCountElement.textContent = totalItems;
      cartCountElement.style.display = totalItems > 0 ? "flex" : "none";
    }
  };

  const addToCart = (charger) => {
    const session = JSON.parse(localStorage.getItem("currentSession") || '{"loggedIn": false}');

    if (!session.loggedIn) {
      window.location.href = "/login";
      return;
    }

    let userId = session.userId;
    let userCartKey = `cart_${userId}`;
    let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];

    const existingProductIndex = cart.findIndex((item) => item.id === charger.id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({
        id: charger.id,
        title: charger.title,
        brand: charger.brand,
        wattage: charger.wattage,
        outputCurrent: charger.outputCurrent,
        image: charger.image,
        price: charger.originalPrice,
        discount: parseFloat(charger.discount),
        quantity: 1,
      });
    }

    localStorage.setItem(userCartKey, JSON.stringify(cart));
    updateCartCount(cart);
    setCartItem(charger.title);
    setTimeout(() => setCartItem(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Cart Message */}
      {cartItem && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slideIn flex items-center gap-3">
          <Check className="w-5 h-5" />
          <span className="flex-1">{cartItem} added to cart!</span>
          <Link to="/cart" className="text-white underline hover:no-underline">View Cart</Link>
          <button onClick={() => setCartItem(null)} className="ml-2 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-8"> {/* ✅ Added pt-24 to avoid header overlap */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 xl:w-1/5 lg:order-first lg:sticky lg:top-28 self-start"> {/* ✅ Fixed width for better left positioning, order-first for left, top-28 for extra clearance */}
            <ChargerFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
            />
          </aside>

          {/* Product Grid */}
          <main className="flex-1"> {/* ✅ Added mt-4 to main for extra top margin if needed */}
            <div className="mb-6 mt-6"> {/* ✅ Added mt-4 to the header section */}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Premium <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Chargers</span>
              </h2>
              <p className="text-gray-600">
                Showing {filteredChargers.length} {filteredChargers.length === 1 ? 'charger' : 'chargers'}
              </p>
            </div>

            {/* (Existing product rendering remains same as your version) */}
            {/* ✅ The filter logic now includes outputCurrent */}
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
            ) : filteredChargers.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
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
                {filteredChargers.map((charger, index) => {
                  const discountedPrice = calculateDiscountedPrice(charger.originalPrice, charger.discount);
                  return (
                    <div key={charger.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fadeInUp hover:-translate-y-2">
                      {/* Your existing charger card UI stays unchanged */}
                      {/* ✅ No import of ChargerCard needed */}
                      <Link to={`/chargers/${charger.id}`} className="block">
                        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                          <img
                            src={charger.image}
                            alt={charger.title}
                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                            {charger.discount} OFF
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {charger.title}
                          </h3>
                          <div className="flex items-baseline gap-3 mb-4">
                            <span className="text-2xl font-bold text-gray-900">
                              ₹{parseFloat(discountedPrice).toLocaleString('en-IN')}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{parseFloat(charger.originalPrice).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <ul className="space-y-2 text-sm text-gray-600 border-t pt-3 mb-4">
                            <li className="flex justify-between"><span className="font-semibold">Brand:</span> <span>{charger.brand}</span></li>
                            <li className="flex justify-between"><span className="font-semibold">Type:</span> <span>{charger.type}</span></li>
                            <li className="flex justify-between"><span className="font-semibold">Wattage:</span> <span>{charger.wattage}W</span></li>
                            <li className="flex justify-between"><span className="font-semibold">Output Current:</span> <span>{charger.outputCurrent}</span></li>
                          </ul>
                        </div>
                      </Link>
                      <div className="px-5 pb-5">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(charger);
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
    </div>
  );
};

export default ChargersPage;