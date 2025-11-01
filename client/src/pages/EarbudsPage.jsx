import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Check } from 'lucide-react';
import EarbudsFilter from '../components/filters/EarbudsFilter';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContent'; // ✅ Import useCart

const EarbudsPage = () => {
  const [earbuds, setEarbuds] = useState([]);
  const [filteredEarbuds, setFilteredEarbuds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItem, setCartItem] = useState(null);

  // ✅ Get the updateCart function from the context
  const { updateCart } = useCart();

  // Filter states
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
  const navigate = useNavigate();

  // Fetch earbuds data
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

  // ⛔️ Removed useEffect for initial cart count.
  // This is now handled by the Header component using CartContext.

  // Apply filters
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...earbuds];

      // Brand filter
      if (filters.brands.length > 0) {
        filtered = filtered.filter((earbud) => {
          const includesOthers = filters.brands.includes("Others");
          const includesSpecificBrand = filters.brands.includes(earbud.brand);
          const isOtherBrand = !mainBrands.includes(earbud.brand);

          if (!includesOthers) {
            return includesSpecificBrand;
          } else {
            return isOtherBrand;
          }
        });
      }

      // Battery Life filter
      if (filters.batteryLife.length > 0) {
        filtered = filtered.filter((earbud) => {
          const earbudBattery = parseInt(earbud.batteryLife);
          return filters.batteryLife.some((battery) => earbudBattery >= battery);
        });
      }

      // Design filter
      if (filters.designs.length > 0) {
        filtered = filtered.filter((earbud) => filters.designs.includes(earbud.design));
      }

      // Discount filter
      if (filters.discount.length > 0) {
        filtered = filtered.filter((earbud) => {
          const earbudDiscount = parseInt(earbud.discount);
          return filters.discount.some((disc) => earbudDiscount >= disc);
        });
      }

      setFilteredEarbuds(filtered);
    };

    applyFilters();
  }, [filters, earbuds]);

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

  const calculateDiscountedPrice = (originalPrice, discount) => {
    return (originalPrice - (originalPrice * parseFloat(discount) / 100)).toFixed(2);
  };

  // ⛔️ Removed local updateCartCount function.

  // ✅ Updated addToCart with CartContext
  const addToCart = async (earbud) => {
    try {
      // Verify user session via API
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        navigate('/sign-in');
        return;
      }

      const userData = await response.json();
      if (!userData.success || !userData.user) {
        navigate('/sign-in');
        return;
      }

      const userId = userData.user.user_id;
      // ✅ Use the same key format as your CartContext ("cart_user_")
      const userCartKey = `cart_user_${userId}`;

      if (!earbud || !earbud.id) {
        setError('Product data not available');
        return;
      }

      const productData = earbud;
      let currentCart = JSON.parse(localStorage.getItem(userCartKey)) || [];

      const existingProductIndex = currentCart.findIndex((item) => item.id === productData.id);

      let updatedCart;
      if (existingProductIndex !== -1) {
        updatedCart = [...currentCart];
        updatedCart[existingProductIndex].quantity += 1;
      } else {
        updatedCart = [...currentCart, {
          id: productData.id,
          title: productData.title,
          brand: productData.brand,
          batteryLife: productData.batteryLife,
          design: productData.design,
          image: productData.image,
          price: productData.originalPrice,
          discount: parseFloat(productData.discount),
          quantity: 1,
        }];
      }

      // ✅ Use the context function to update localStorage and state
      updateCart(updatedCart, userId);

      setCartItem(productData.title);
      setTimeout(() => setCartItem(null), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      navigate('/sign-in');
      setCartItem(`${earbud?.title || 'Item'} added to cart! (Please log in to sync)`);
      setTimeout(() => setCartItem(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Cart Message */}
      <Header />
      {cartItem && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slideIn flex items-center gap-3">
          <Check className="w-5 h-5" />
          <span className="flex-1">{cartItem}</span>
          {/* ✅ Changed <a> to <Link> for React Router */}
          <Link to="/cart" className="text-white underline hover:no-underline">View Cart</Link>
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
            <EarbudsFilter
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
                Premium <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Earbuds</span>
              </h2>
              <p className="text-gray-600">
                Showing {filteredEarbuds.length} {filteredEarbuds.length === 1 ? 'earbud' : 'earbuds'}
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
            ) : filteredEarbuds.length === 0 ? (
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
                {filteredEarbuds.map((earbud, index) => {
                  const discountedPrice = calculateDiscountedPrice(earbud.originalPrice, earbud.discount);
                  const discPrice = parseFloat(discountedPrice).toLocaleString('en-IN');

                  return (
                    <div
                      key={earbud.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fadeInUp hover:-translate-y-2"
                      style={{ animationDelay: `${index * 50}ms` }}>

                      <Link to={`/earphone/${earbud.id}`} className="block">
                        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-video"> {/* ✅ Added aspect-video for consistent 16:9 ratio */}
                          <img
                            src={earbud.image}
                            alt={earbud.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                            {earbud.discount}% OFF
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {earbud.title}
                          </h3>

                          <div className="flex items-baseline gap-3 mb-4">
                            <span className="text-2xl font-bold text-gray-900">
                              ₹{discPrice}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{parseFloat(earbud.originalPrice).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <ul className="space-y-2 text-sm text-gray-600 border-t pt-3 mb-4">
                            <li className="flex justify-between">
                              <span className="font-semibold">Brand:</span>
                              <span>{earbud.brand}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="font-semibold">Battery Life:</span>
                              <span>{earbud.batteryLife} hours</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="font-semibold">Design:</span>
                              <span>{earbud.design}</span>
                            </li>
                          </ul>
                        </div>
                      </Link>

                      <div className="px-5 pb-5">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(earbud);
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
      <Footer />
    </div>
  );
};

export default EarbudsPage;