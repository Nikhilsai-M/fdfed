import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContent';
import { ShoppingCart, X, Check, Zap } from 'lucide-react';
import '../styles/FilterLaptops.css';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { addCartItem } from '../services/cartApi';

// LaptopFilter Component (now integrated)
const LaptopFilter = ({ filters, onFilterChange, onClearFilters }) => {
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
      filters.processors.length +
      filters.generations.length +
      filters.rams.length +
      filters.storageTypes.length +
      filters.storageCapacities.length +
      filters.displays.length +
      filters.oses.length +
      filters.weights.length +
      filters.conditions.length +
      filters.discounts.length
    );
  };

  const activeCount = getActiveFilterCount();

  return (
    <div className="laptop-filter-container">
      <div className="laptop-filter-header">
        <h3 className="laptop-filter-title">Filters</h3>
        {activeCount > 0 && (
          <span className="laptop-filter-count">{activeCount}</span>
        )}
      </div>

      {/* Active Filters Display */}
      {activeCount > 0 && (
        <div className="laptop-active-filters-section">
          <div className="laptop-active-filters-header">
            <h4 className="laptop-section-title-sm">Active Filters</h4>
            <button 
              className="laptop-btn-clear-all" 
              onClick={onClearFilters}
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      <div className="laptop-filter-sections">
        {/* Brand Filter */}
        <div className="laptop-filter-section">
          <h4 className="laptop-section-title">Brand</h4>
          <div className="laptop-filter-options">
            {['ACER', 'DELL', 'HP', 'LENOVO', 'APPLE', 'ASUS', 'MICROSOFT', 'MSI', 'Others'].map(brand => (
              <label key={brand} className="laptop-filter-checkbox">
                <input
                  type="checkbox"
                  value={brand}
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleCheckboxChange('brands', brand)}
                />
                <span className="laptop-checkbox-label">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="laptop-filter-section">
          <h4 className="laptop-section-title">Price Range</h4>
          <div className="laptop-price-filter">
            <div className="laptop-price-inputs">
              <div className="laptop-price-input-group">
                <label className="laptop-price-label">Min</label>
                <div className="laptop-price-input-wrapper">
                  <span className="laptop-currency-symbol">₹</span>
                  <input
                    type="number"
                    className="laptop-price-input"
                    placeholder="0"
                    value={filters.minPrice || ''}
                    onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  />
                </div>
              </div>
              <div className="laptop-price-separator">-</div>
              <div className="laptop-price-input-group">
                <label className="laptop-price-label">Max</label>
                <div className="laptop-price-input-wrapper">
                  <span className="laptop-currency-symbol">₹</span>
                  <input
                    type="number"
                    className="laptop-price-input"
                    placeholder="200000"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Processor Filter */}
        <div className="laptop-filter-section">
          <h4 className="laptop-section-title">Processor</h4>
          <div className="laptop-filter-options">
            {['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Apple M3'].map(processor => (
              <label key={processor} className="laptop-filter-checkbox">
                <input
                  type="checkbox"
                  value={processor}
                  checked={filters.processors.includes(processor)}
                  onChange={() => handleCheckboxChange('processors', processor)}
                />
                <span className="laptop-checkbox-label">{processor}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Generation Filter */}
        <div className="laptop-filter-section">
          <h4 className="laptop-section-title">Generation</h4>
          <div className="laptop-filter-options">
            {['10th', '11th', '12th', '13th', '14th', 'Latest'].map(gen => (
              <label key={gen} className="laptop-filter-checkbox">
                <input
                  type="checkbox"
                  value={gen}
                  checked={filters.generations.includes(gen)}
                  onChange={() => handleCheckboxChange('generations', gen)}
                />
                <span className="laptop-checkbox-label">{gen}</span>
              </label>
            ))}
          </div>
        </div>

        {/* RAM Filter */}
        <div className="laptop-filter-section">
          <h4 className="laptop-section-title">RAM</h4>
          <div className="laptop-filter-options">
            <div className="laptop-filter-grid">
              {['4GB', '8GB', '16GB', '32GB', '64GB'].map(ram => (
                <label key={ram} className="laptop-filter-chip">
                  <input
                    type="checkbox"
                    value={ram}
                    checked={filters.rams.includes(ram)}
                    onChange={() => handleCheckboxChange('rams', ram)}
                  />
                  <span className="laptop-chip-label">{ram}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Storage Type Filter */}
        <div className="laptop-filter-section">
          <h4 className="laptop-section-title">Storage Type</h4>
          <div className="laptop-filter-options">
            {['SSD', 'HDD', 'NVMe SSD', 'eMMC'].map(type => (
              <label key={type} className="laptop-filter-checkbox">
                <input
                  type="checkbox"
                  value={type}
                  checked={filters.storageTypes.includes(type)}
                  onChange={() => handleCheckboxChange('storageTypes', type)}
                />
                <span className="laptop-checkbox-label">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Storage Capacity Filter */}
        <div className="laptop-filter-section">
          <h4 className="laptop-section-title">Storage Capacity</h4>
          <div className="laptop-filter-options">
            <div className="laptop-filter-grid">
              {['128GB', '256GB', '512GB', '1TB', '2TB', '4TB+'].map(capacity => (
                <label key={capacity} className="laptop-filter-chip">
                  <input
                    type="checkbox"
                    value={capacity}
                    checked={filters.storageCapacities.includes(capacity)}></input>
                  <span className="laptop-checkbox-label">{capacity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Display Filter */}
        <div className="laptop-filter-section">
          <h4 className="laptop-section-title">Display</h4>
          <div className="laptop-filter-options">
            {['13.3"', '14"', '15.6"', '16"', '17.3"', 'Touchscreen', '2K', '4K', 'OLED'].map(display => (
              <label key={display} className="laptop-filter-checkbox">
                <input
                  type="checkbox"
                  value={display}
                  checked={filters.displays.includes(display)}
                  onChange={() => handleCheckboxChange('displays', display)}
                />
                <span className="laptop-checkbox-label">{display}</span>
              </label>
            ))}
          </div>
        </div>

        {/* OS Filter */}
        <div className="laptop-filter-section">
          <h4 className="laptop-section-title">Operating System</h4>
          <div className="laptop-filter-options">
            {['Windows 11', 'Windows 10', 'macOS', 'Chrome OS', 'Ubuntu', 'DOS'].map(os => (
              <label key={os} className="laptop-filter-checkbox">
                <input
                  type="checkbox"
                  value={os}
                  checked={filters.oses.includes(os)}
                  onChange={() => handleCheckboxChange('oses', os)}
                />
                <span className="laptop-checkbox-label">{os}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Weight Filter */}
        <div className="laptop-filter-section">
          <h4 className="laptop-section-title">Weight</h4>
          <div className="laptop-filter-options">
            {['Ultra-light (<1.5kg)', 'Light (1.5-2kg)', 'Standard (2-2.5kg)', 'Heavy (>2.5kg)'].map(weight => (
              <label key={weight} className="laptop-filter-checkbox">
                <input
                  type="checkbox"
                  value={weight}
                  checked={filters.weights.includes(weight)}
                  onChange={() => handleCheckboxChange('weights', weight)}
                />
                <span className="laptop-checkbox-label">{weight}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Condition Filter */}
        <div className="laptop-filter-section">
          <h4 className="laptop-section-title">Condition</h4>
          <div className="laptop-filter-options">
            <div className="laptop-filter-grid">
              {['New', 'Refurbished', 'Used'].map(condition => (
                <label key={condition} className="laptop-filter-chip">
                  <input
                    type="checkbox"
                    value={condition}
                    checked={filters.conditions.includes(condition)}
                    onChange={() => handleCheckboxChange('conditions', condition)}
                  />
                  <span className="laptop-chip-label">{condition}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Discount Filter */}
        <div className="laptop-filter-section">
          <h4 className="laptop-section-title">Discount</h4>
          <div className="laptop-filter-options">
            {['10% or more', '20% or more', '30% or more', '40% or more', '50% or more'].map(discount => (
              <label key={discount} className="laptop-filter-checkbox">
                <input
                  type="checkbox"
                  value={discount}
                  checked={filters.discounts.includes(discount)}
                  onChange={() => handleCheckboxChange('discounts', discount)}
                />
                <span className="laptop-checkbox-label">{discount}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ProductCard Component (updated with proper event handling)
const ProductCard = ({ product, onAddToCart, onBuyNow }) => {
  const navigate = useNavigate();
  
  const handleCardClick = (e) => {
    // Only navigate if the click wasn't on a button
    if (!e.target.closest('.laptop-product-actions')) {
      navigate(`/laptop/${product.id}`);
    }
  };

  const calculateFinalPrice = (laptop) => {
    const price = parseFloat(laptop.pricing.basePrice || 0);
    const discount = parseFloat(laptop.pricing.discount || 0);
    return Number((price - (price * discount / 100)).toFixed(2));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation(); // This prevents the card click from firing
    console.log('Add to Cart clicked for:', product.brand, product.series);
    onAddToCart(product);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation(); // This prevents the card click from firing
    console.log('Buy Now clicked for:', product.brand, product.series);
    onBuyNow(product);
  };

  const finalPrice = calculateFinalPrice(product);
  const originalPrice = product.pricing.basePrice;

  return (
    <div className="laptop-product" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="laptop-product-container">
        <div className="laptop-product-image">
          <img 
            src={product.image} 
            alt={`${product.brand} ${product.series}`}
            loading="lazy"
          />
          {product.pricing.discount > 0 && (
            <div className="laptop-discount-badge">{product.pricing.discount}% OFF</div>
          )}
          <div className="laptop-condition-badge">{product.condition}</div>
        </div>
      
        <div c  lassName="laptop-product-details">
          <h4>{product.brand} {product.series}</h4>
          
          <div className="laptop-price-section">
            <span className="laptop-original-price">₹{originalPrice.toLocaleString()}</span>
            <h3 className="laptop-discounted-price">₹{finalPrice.toLocaleString()}</h3>
          </div>

          <ul className="laptop-specs-list">
            <li><strong>Processor:</strong> {product.processor.name} {product.processor.generation}</li>
            <li><strong>RAM:</strong> {product.memory.ram}</li>
            <li><strong>Storage:</strong> {product.memory.storage.type} {product.memory.storage.capacity}</li>
            <li><strong>Display:</strong> {product.displaysize}"</li>
            <li><strong>OS:</strong> {product.os}</li>
          </ul>

          <div className="laptop-product-actions">
            <button 
              className="laptop-add-to-cart-btn"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="laptop-cart-icon" />
              <span>Add to Cart</span>
            </button>
            <button 
              className="laptop-buy-now-btn"
              onClick={handleBuyNow}
            >
              <Zap className="laptop-zap-icon" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main FilterLaptops Component
const FilterLaptops = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [laptops, setLaptops] = useState([]);
  const [filteredLaptops, setFilteredLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [],
    processors: [],
    generations: [],
    rams: [],
    storageTypes: [],
    storageCapacities: [],
    displays: [],
    oses: [],
    weights: [],
    conditions: [],
    discounts: [],
    minPrice: 0,
    maxPrice: 200000
  });
  
  const [cartItem, setCartItem] = useState(null);
  const navigate = useNavigate();
  const { updateCart } = useCart();

  // Get URL parameters
  const brandFromUrl = searchParams.get('brand');
  const maxPriceFromUrl = searchParams.get('maxPrice');

  useEffect(() => {
    fetchLaptops();
  }, []);

  useEffect(() => {
    // Apply URL parameters to filters when component mounts
    if (brandFromUrl || maxPriceFromUrl) {
      applyUrlFilters();
    } else {
      loadFiltersFromStorage();
    }
  }, [brandFromUrl, maxPriceFromUrl, laptops]);

  useEffect(() => {
    filterProducts();
    storeFiltersToStorage();
  }, [selectedFilters, laptops]);

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
    window.history.replaceState({}, '', '/filter-buy-laptop');
  };

  // Fetch laptops from database (similar to phones)
  const fetchLaptops = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/laptops');
      if (!response.ok) {
        throw new Error('Failed to fetch laptops');
      }
      const data = await response.json();
      setLaptops(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching laptops:', error);
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
      processors: [],
      generations: [],
      rams: [],
      storageTypes: [],
      storageCapacities: [],
      displays: [],
      oses: [],
      weights: [],
      conditions: [],
      discounts: [],
      minPrice: 0,
      maxPrice: 200000
    });
    localStorage.removeItem('selectedLaptopFilters');
  };

  const filterProducts = () => {
    const mainBrands = ["ACER", "DELL", "HP", "LENOVO", "APPLE", "ASUS", "MICROSOFT", "MSI"];
    
    const filtered = laptops.filter(laptop => {
      if (!laptop || !laptop.pricing) return false;

      const finalPrice = calculateFinalPrice(laptop);
      
      // Brand filter
      if (selectedFilters.brands.length > 0) {
        const includesOthers = selectedFilters.brands.includes("Others");
        const includesSpecificBrand = selectedFilters.brands.some(brand => 
          laptop.brand && brand.toUpperCase() === laptop.brand.toUpperCase()
        );
        const isOtherBrand = laptop.brand && !mainBrands.some(mainBrand => 
          mainBrand.toUpperCase() === laptop.brand.toUpperCase()
        );
        if (!includesSpecificBrand && !(includesOthers && isOtherBrand)) {
          return false;
        }
      }

      // Price filter
      if (finalPrice < selectedFilters.minPrice || finalPrice > selectedFilters.maxPrice) return false;

      // Processor filter
      if (selectedFilters.processors.length > 0 && 
          !selectedFilters.processors.some(proc => 
            laptop.processor.name.toLowerCase().includes(proc.toLowerCase())
          )) {
        return false;
      }

      // Generation filter
      if (selectedFilters.generations.length > 0 && 
          !selectedFilters.generations.includes(laptop.processor.generation)) {
        return false;
      }

      // RAM filter
      if (selectedFilters.rams.length > 0 && 
          !selectedFilters.rams.some(ram => laptop.memory.ram.includes(ram))) {
        return false;
      }

      // Storage type filter
      if (selectedFilters.storageTypes.length > 0 && 
          !selectedFilters.storageTypes.includes(laptop.memory.storage.type)) {
        return false;
      }

      // Storage capacity filter
      if (selectedFilters.storageCapacities.length > 0 && 
          !selectedFilters.storageCapacities.some(capacity => 
            laptop.memory.storage.capacity.includes(capacity.replace('GB', '').replace('TB', ''))
          )) {
        return false;
      }

      // Display filter
      if (selectedFilters.displays.length > 0 && 
          !selectedFilters.displays.some(display => 
            laptop.displaysize && laptop.displaysize.toString().includes(display.replace('"', ''))
          )) {
        return false;
      }

      // OS filter
      if (selectedFilters.oses.length > 0 && 
          !selectedFilters.oses.includes(laptop.os)) {
        return false;
      }

      // Condition filter
      if (selectedFilters.conditions.length > 0 && 
          !selectedFilters.conditions.includes(laptop.condition)) {
        return false;
      }

      // Discount filter
      if (selectedFilters.discounts.length > 0 && 
          !selectedFilters.discounts.some(discount => 
            laptop.pricing.discount >= parseInt(discount)
          )) {
        return false;
      }

      return true;
    });

    setFilteredLaptops(filtered);
  };

  const calculateFinalPrice = (laptop) => {
    const price = parseFloat(laptop.pricing.basePrice || 0);
    const discount = parseFloat(laptop.pricing.discount || 0);
    return Number((price - (price * discount / 100)).toFixed(2));
  };

  const storeFiltersToStorage = () => {
    localStorage.setItem('selectedLaptopFilters', JSON.stringify(selectedFilters));
  };

  const loadFiltersFromStorage = () => {
    const storedFilters = localStorage.getItem('selectedLaptopFilters');
    if (storedFilters) {
      setSelectedFilters(JSON.parse(storedFilters));
    }
  };

  // Add to cart function
  const addToCart = async (laptop) => {
    try {
      console.log('Adding to cart:', laptop);
      
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

      if (!laptop || !laptop.id) {
        console.error('Laptop data not available');
        return;
      }

      let currentCart = JSON.parse(localStorage.getItem(userCartKey)) || [];

      const existingProductIndex = currentCart.findIndex((item) => item.id === laptop.id);

      let updatedCart;
      if (existingProductIndex !== -1) {
        updatedCart = [...currentCart];
        updatedCart[existingProductIndex].quantity += 1;
      } else {
        const finalPrice = calculateFinalPrice(laptop);
        updatedCart = [...currentCart, {
          id: laptop.id,
          name: `${laptop.brand} ${laptop.series}`,
          brand: laptop.brand,
          processor: `${laptop.processor.name} ${laptop.processor.generation}`,
          ram: laptop.memory.ram,
          storage: `${laptop.memory.storage.type} ${laptop.memory.storage.capacity}`,
          display: `${laptop.displaysize}"`,
          os: laptop.os,
          image: laptop.image,
          price: finalPrice,
          originalPrice: laptop.pricing.basePrice,
          discount: laptop.pricing.discount,
          quantity: 1,
          type: 'laptop'
        }];
      }

      // Save to localStorage
      localStorage.setItem(userCartKey, JSON.stringify(updatedCart));

      // Update the context
      updateCart(updatedCart, userId);

      // Show success message
      setCartItem(`${laptop.brand} ${laptop.series} added to cart!`);
      setTimeout(() => setCartItem(null), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      navigate('/sign-in');
    }
  };

  const addToCartBackend = async (laptop) => {
    try {
      if (!laptop || !laptop.id) {
        console.error('Laptop data not available');
        return;
      }

      const cart = await addCartItem({
        productType: 'laptop',
        productId: laptop.id,
        quantity: 1,
      });

      await updateCart(cart);

      setCartItem(`${laptop.brand} ${laptop.series} added to cart!`);
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

  // Buy Now function for laptops  // Buy Now function for laptops
  const buyNow = async (laptop) => {
    try {
      console.log('Buy Now clicked for:', laptop);
      
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

      if (!laptop || !laptop.id) {
        console.error('Laptop data not available');
        return;
      }

      // Calculate price locally
      const finalPrice = calculateFinalPrice(laptop);

      const paymentData = {
        price: finalPrice,
        type: 'laptop',
        id: laptop.id,
        laptop: laptop,
        userId: userId,
      };

      // Navigate to frontend payment page
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
          <p className="text-gray-600">Loading laptops...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="laptop-page min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
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
            {selectedFilters.brands.length > 0 ? `${selectedFilters.brands.join(', ')} Laptops` : 'Find Your Perfect Laptop'}
          </h1>
          <p className="text-gray-600">
            {selectedFilters.brands.length > 0 
              ? `Browse all ${selectedFilters.brands.join(', ')} laptops` 
              : 'Filter through our collection of premium laptops'
            }
            {selectedFilters.maxPrice < 200000 && ` under ₹${selectedFilters.maxPrice.toLocaleString()}`}
          </p>
        </div>

        <div className="laptop-page-container">
          <LaptopFilter
            filters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
          
          <div className="laptop-products" id="product-list">
            {filteredLaptops.length === 0 ? (
              <div className="laptop-no-products">
                <h3>No products match your filters</h3>
                <p>Try adjusting your filter criteria or <button className="laptop-clear-all-inline" onClick={handleClearFilters}>clear all filters</button></p>
              </div>
            ) : (
              filteredLaptops.map(laptop => (
                <ProductCard 
                  key={laptop.id} 
                  product={laptop}
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

export default FilterLaptops;
