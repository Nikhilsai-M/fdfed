import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContent';
import '../styles/FilterPhones.css';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Check, X, ShoppingCart, Zap } from 'lucide-react';
import { addCartItem } from '../services/cartApi';

// PhoneFilter Component (now integrated)
const PhoneFilter = ({ filters, onFilterChange, onClearFilters }) => {
  const handleCheckboxChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  const handlePriceChange = (type, value) => {
    const numValue = parseInt(value) || 0;
    onFilterChange(type, numValue);
  };

  // Get count of active filters
  const getActiveFilterCount = () => {
    return (
      filters.brands.length +
      filters.rams.length +
      filters.roms.length +
      filters.batteries.length +
      filters.conditions.length +
      filters.discounts.length
    );
  };

  const activeCount = getActiveFilterCount();

  return (
    <div className="phone-filter-container">
      <div className="phone-filter-header">
        <h3 className="phone-filter-title">Filters</h3>
        {activeCount > 0 && (
          <span className="phone-filter-count">{activeCount}</span>
        )}
      </div>

      {/* Active Filters Display */}
      {activeCount > 0 && (
        <div className="phone-active-filters-section">
          <div className="phone-active-filters-header">
            <h4 className="phone-section-title-sm">Active Filters</h4>
            <button 
              className="phone-btn-clear-all" 
              onClick={onClearFilters}
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      <div className="phone-filter-sections">
        {/* Brand Filter */}
        <div className="phone-filter-section">
          <h4 className="phone-section-title">Brand</h4>
          <div className="phone-filter-options">
            {['APPLE', 'SAMSUNG', 'ONEPLUS', 'GOOGLE', 'REALME', 'XIAOMI', 'MOTOROLA', 'VIVO', 'LENOVO', 'NOTHING', 'Others'].map(brand => (
              <label key={brand} className="phone-filter-checkbox">
                <input
                  type="checkbox"
                  value={brand}
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleCheckboxChange('brands', brand)}
                />
                <span className="phone-checkbox-label">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="phone-filter-section">
          <h4 className="phone-section-title">Price Range</h4>
          <div className="phone-price-filter">
            <div className="phone-price-inputs">
              <div className="phone-price-input-group">
                <label className="phone-price-label">Min</label>
                <div className="phone-price-input-wrapper">
                  <span className="phone-currency-symbol">₹</span>
                  <input
                    type="number"
                    className="phone-price-input"
                    placeholder="0"
                    value={filters.minPrice || ''}
                    onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                    min="0"
                    max="150000"
                  />
                </div>
              </div>
              <div className="phone-price-separator">—</div>
              <div className="phone-price-input-group">
                <label className="phone-price-label">Max</label>
                <div className="phone-price-input-wrapper">
                  <span className="phone-currency-symbol">₹</span>
                  <input
                    type="number"
                    className="phone-price-input"
                    placeholder="150000"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                    min="0"
                    max="150000"
                  />
                </div>
              </div>
            </div>
            
            <div className="phone-price-range-sliders">
              <input
                type="range"
                className="phone-range-slider phone-range-min"
                min="0"
                max="150000"
                step="1000"
                value={filters.minPrice}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              />
              <input
                type="range"
                className="phone-range-slider phone-range-max"
                min="0"
                max="150000"
                step="1000"
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* RAM Filter */}
        <div className="phone-filter-section">
          <h4 className="phone-section-title">RAM</h4>
          <div className="phone-filter-options phone-filter-grid">
            {[3, 4, 6, 8, 12].map(ram => (
              <label key={ram} className="phone-filter-chip">
                <input
                  type="checkbox"
                  value={ram}
                  checked={filters.rams.includes(ram)}
                  onChange={() => handleCheckboxChange('rams', ram)}
                />
                <span className="phone-chip-label">{ram}GB</span>
              </label>
            ))}
          </div>
        </div>

        {/* Storage Filter */}
        <div className="phone-filter-section">
          <h4 className="phone-section-title">Storage</h4>
          <div className="phone-filter-options phone-filter-grid">
            {[32, 64, 128, 256, 512].map(rom => (
              <label key={rom} className="phone-filter-chip">
                <input
                  type="checkbox"
                  value={rom}
                  checked={filters.roms.includes(rom)}
                  onChange={() => handleCheckboxChange('roms', rom)}
                />
                <span className="phone-chip-label">{rom}GB</span>
              </label>
            ))}
          </div>
        </div>

        {/* Battery Filter */}
        <div className="phone-filter-section">
          <h4 className="phone-section-title">Battery</h4>
          <div className="phone-filter-options">
            {[
              { value: '2000-3000', label: '2000 - 3000 mAh' },
              { value: '3000-4000', label: '3000 - 4000 mAh' },
              { value: '4000-5000', label: '4000 - 5000 mAh' },
              { value: '5000-6000', label: '5000 - 6000 mAh' }
            ].map(battery => (
              <label key={battery.value} className="phone-filter-checkbox">
                <input
                  type="checkbox"
                  value={battery.value}
                  checked={filters.batteries.includes(battery.value)}
                  onChange={() => handleCheckboxChange('batteries', battery.value)}
                />
                <span className="phone-checkbox-label">{battery.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Condition Filter */}
        <div className="phone-filter-section">
          <h4 className="phone-section-title">Condition</h4>
          <div className="phone-filter-options phone-filter-grid">
            {['Superb', 'Very Good', 'Good'].map(condition => (
              <label key={condition} className="phone-filter-chip">
                <input
                  type="checkbox"
                  value={condition}
                  checked={filters.conditions.includes(condition)}
                  onChange={() => handleCheckboxChange('conditions', condition)}
                />
                <span className="phone-chip-label">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Discount Filter */}
        <div className="phone-filter-section">
          <h4 className="phone-section-title">Discount</h4>
          <div className="phone-filter-options">
            {[10, 20, 30, 40, 50].map(discount => (
              <label key={discount} className="phone-filter-checkbox">
                <input
                  type="checkbox"
                  value={discount}
                  checked={filters.discounts.includes(discount)}
                  onChange={() => handleCheckboxChange('discounts', discount)}
                />
                <span className="phone-checkbox-label">{discount}% or more</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ProductCard Component (now integrated)
const ProductCard = ({ product, onAddToCart, onBuyNow }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const calculateDiscountedPrice = (price, discount) => {
    const numericPrice = parseFloat(price);
    const numericDiscount = parseFloat(discount);
    if (isNaN(numericPrice) || isNaN(numericDiscount)) {
      return 0;
    }
    return numericPrice - (numericPrice * numericDiscount / 100);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBuyNow(product);
  };

  const discountedPrice = calculateDiscountedPrice(product.pricing.basePrice, product.pricing.discount);

  return (
    <div className="phone-product" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="phone-product-container">
        <div className="phone-product-image">
          <img src={product.image} alt={`${product.brand} ${product.model}`} />
          <div className="phone-discount-badge">{product.pricing.discount}% OFF</div>
          <div className="phone-condition-badge">{product.condition}</div>
        </div>
        <div className="phone-product-details">
          <h4>{product.brand} {product.model}</h4>
          <p className="phone-discounted-price">₹{discountedPrice.toFixed(0)}</p>
          <span className="phone-original-price">₹{product.pricing.basePrice}</span>
          <span className="phone-discount">{product.pricing.discount}% Off</span>
          <ul className="phone-specs-list">
            <li>{product.ram} RAM | {product.rom} Storage</li>
            <li>{product.specs.battery}mAh Battery</li>
            <li>Condition: {product.condition}</li>
          </ul>
          <div className="phone-product-actions">
            <button 
              className="phone-add-to-cart-btn"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </button>
            <button 
              className="phone-buy-now-btn"
              onClick={handleBuyNow}
            >
              <Zap className="w-4 h-4 mr-2" />
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main FilterPhones Component
const FilterPhones = () => {
  const [phones, setPhones] = useState([]);
  const [filteredPhones, setFilteredPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [],
    rams: [],
    roms: [],
    batteries: [],
    conditions: [],
    discounts: [],
    minPrice: 0,
    maxPrice: 150000
  });
  const [cartItem, setCartItem] = useState(null);
  const navigate = useNavigate();

  // ✅ Get the updateCart function from the context
  const { updateCart } = useCart();

  // Get URL parameters
  const brandFromUrl = searchParams.get('brand');
  const maxPriceFromUrl = searchParams.get('maxPrice');

  useEffect(() => {
    fetchPhones();
  }, []);

  useEffect(() => {
    // Apply URL parameters to filters when component mounts
    if (brandFromUrl || maxPriceFromUrl) {
      applyUrlFilters();
    } else {
      loadFiltersFromStorage();
    }
  }, [brandFromUrl, maxPriceFromUrl, phones]);

  useEffect(() => {
    filterProducts();
    storeFiltersToStorage();
  }, [selectedFilters, phones]);

  const applyUrlFilters = () => {
    const newFilters = { ...selectedFilters };
    
    if (brandFromUrl) {
      newFilters.brands = [brandFromUrl];
    }
    
    if (maxPriceFromUrl) {
      newFilters.maxPrice = parseInt(maxPriceFromUrl);
    }
    
    setSelectedFilters(newFilters);
    
    // Clear URL parameters after applying to avoid reapplying on refresh
    window.history.replaceState({}, '', '/filter-buy-phone');
  };

  const fetchPhones = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/phones');
      if (!response.ok) {
        throw new Error('Failed to fetch phones');
      }
      const data = await response.json();
      setPhones(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching phones:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      if (['minPrice', 'maxPrice'].includes(filterType)) {
        return { ...prev, [filterType]: value };
      }
      
      const currentValues = prev[filterType];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [filterType]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...currentValues, value]
        };
      }
    });
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      brands: [],
      rams: [],
      roms: [],
      batteries: [],
      conditions: [],
      discounts: [],
      minPrice: 0,
      maxPrice: 150000
    });
    localStorage.removeItem('selectedFilters');
  };

  const filterProducts = () => {
    const mainBrands = ["APPLE", "SAMSUNG", "ONEPLUS", "GOOGLE", "REALME", "XIAOMI", "MOTOROLA", "VIVO", "LENOVO", "NOTHING"];
    
    const filtered = phones.filter(phone => {
      if (!phone || !phone.pricing) return false;

      const discountedPrice = calculateDiscountedPrice(phone.pricing.basePrice, phone.pricing.discount);
      
      // Brand filter
      if (selectedFilters.brands.length > 0) {
        const includesOthers = selectedFilters.brands.includes("Others");
        const includesSpecificBrand = selectedFilters.brands.some(brand => 
          phone.brand && brand.toUpperCase() === phone.brand.toUpperCase()
        );
        const isOtherBrand = phone.brand && !mainBrands.some(mainBrand => 
          mainBrand.toUpperCase() === phone.brand.toUpperCase()
        );
        if (!includesSpecificBrand && !(includesOthers && isOtherBrand)) {
          return false;
        }
      }

      // Price filter
      if (discountedPrice < selectedFilters.minPrice || discountedPrice > selectedFilters.maxPrice) return false;

      // RAM filter
      if (selectedFilters.rams.length > 0 && !selectedFilters.rams.includes(parseInt(phone.ram))) return false;

      // Storage filter
      if (selectedFilters.roms.length > 0 && !selectedFilters.roms.includes(parseInt(phone.rom))) return false;

      // Battery filter
      if (selectedFilters.batteries.length > 0) {
        const batteryMatch = selectedFilters.batteries.some(range => {
          const [min, max] = range.split('-').map(Number);
          return phone.specs.battery >= min && phone.specs.battery <= max;
        });
        if (!batteryMatch) return false;
      }

      // Condition filter
      if (selectedFilters.conditions.length > 0 && !selectedFilters.conditions.includes(phone.condition)) return false;

      // Discount filter
      if (selectedFilters.discounts.length > 0 && !selectedFilters.discounts.some(discount => phone.pricing.discount >= discount)) return false;

      return true;
    });

    setFilteredPhones(filtered);
  };

  const calculateDiscountedPrice = (price, discount) => {
    const numericPrice = parseFloat(price);
    const numericDiscount = parseFloat(discount);
    if (isNaN(numericPrice) || isNaN(numericDiscount)) {
      return 0;
    }
    return numericPrice - (numericPrice * numericDiscount / 100);
  };

  const storeFiltersToStorage = () => {
    localStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));
  };

  const loadFiltersFromStorage = () => {
    const storedFilters = localStorage.getItem('selectedFilters');
    if (storedFilters) {
      setSelectedFilters(JSON.parse(storedFilters));
    }
  };

  // ✅ Updated addToCart with proper authentication and cart functionality
  const addToCart = async (phone) => {
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
      const userCartKey = `cart_user_${userId}`;

      if (!phone || !phone.id) {
        console.error('Phone data not available');
        return;
      }

      let currentCart = JSON.parse(localStorage.getItem(userCartKey)) || [];

      const existingProductIndex = currentCart.findIndex((item) => item.id === phone.id);

      let updatedCart;
      if (existingProductIndex !== -1) {
        updatedCart = [...currentCart];
        updatedCart[existingProductIndex].quantity += 1;
      } else {
        updatedCart = [...currentCart, {
          id: phone.id,
          name: `${phone.brand} ${phone.model}`,
          brand: phone.brand,
          model: phone.model,
          ram: phone.ram,
          rom: phone.rom,
          image: phone.image,
          price: phone.pricing.basePrice,
          discount: parseFloat(phone.pricing.discount),
          quantity: 1,
          type: 'phone'
        }];
      }

      // ✅ Save to localStorage immediately after updating the cart
      localStorage.setItem(userCartKey, JSON.stringify(updatedCart));

      // Update the context (assumes this syncs to server if needed)
      updateCart(updatedCart, userId);

      // Keep the UI feedback
      setCartItem(`${phone.brand} ${phone.model} added to cart!`);
      setTimeout(() => setCartItem(null), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Fallback: Add to cart without authentication but prompt login
      navigate('/sign-in');
      setCartItem(`${phone.brand} ${phone.model} added to cart! (Please log in to sync)`);
      setTimeout(() => setCartItem(null), 3000);
    }
  };

  const addToCartBackend = async (phone) => {
    try {
      if (!phone || !phone.id) {
        console.error('Phone data not available');
        return;
      }

      const cart = await addCartItem({
        productType: 'phone',
        productId: phone.id,
        quantity: 1,
      });

      await updateCart(cart);

      setCartItem(`${phone.brand} ${phone.model} added to cart!`);
      setTimeout(() => setCartItem(null), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.status === 401 || error.status === 403) {
        navigate('/sign-in');
        return;
      }

      setCartItem(error.message || 'Unable to add item to cart');
      setTimeout(() => setCartItem(null), 3000);
    }
  };

  // ✅ NEW: Buy Now functionality (same as AccessoryDetails.jsx)  // ✅ NEW: Buy Now functionality (same as AccessoryDetails.jsx)
  const buyNow = async (phone) => {
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

      if (!phone || !phone.id) {
        console.error('Phone data not available');
        return;
      }

      // Calculate price locally
      const discountedPrice = calculateDiscountedPrice(phone.pricing.basePrice, phone.pricing.discount);

      const paymentData = {
        price: discountedPrice,
        type: 'phone',
        id: phone.id,
        phone: phone,
        userId: userId,
      };

      // Navigate to frontend payment page (same as AccessoryDetails)
      navigate('/payment', { 
        state: paymentData 
      });
    } catch (error) {
      console.error('Buy now error:', error);
      navigate('/sign-in');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading phones...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="phone-page min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Cart Message */}
      <Header />
      {cartItem && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slideIn flex items-center gap-3">
          <Check className="w-5 h-5" />
          <span className="flex-1">{cartItem}</span>
          <button 
            onClick={() => navigate('/cart')} 
            className="text-white underline hover:no-underline"
          >
            View Cart
          </button>
          <button onClick={() => setCartItem(null)} className="ml-2 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-10 pb-8">
              <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedFilters.brands.length > 0 ? `${selectedFilters.brands.join(', ')} Phones` : 'Find Your Perfect Phone'}
          </h1>
          <p className="text-gray-600">
            {selectedFilters.brands.length > 0 
              ? `Browse all ${selectedFilters.brands.join(', ')} smartphones` 
              : 'Filter through our collection of premium smartphones'
            }
            {selectedFilters.maxPrice < 150000 && ` under ₹${selectedFilters.maxPrice.toLocaleString()}`}
          </p>
        </div>

        <div className="phone-page-container">
          <PhoneFilter
            filters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
          
          <div className="phone-products" id="product-list">
            {filteredPhones.length === 0 ? (
              <div className="phone-no-products">
                <h3>No products match your filters</h3>
                <p>Try adjusting your filter criteria or <button className="phone-clear-all-inline" onClick={handleClearFilters}>clear all filters</button></p>
              </div>
            ) : (
              filteredPhones.map(phone => (
                <ProductCard 
                  key={phone.id} 
                  product={phone}
                  onAddToCart={addToCartBackend}
                  onBuyNow={buyNow}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FilterPhones;
