import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContent';
import { ShoppingCart, X, Check } from 'lucide-react';
import './FilterLaptops.css';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

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
    <div className="filter-container">
      <div className="filter-header">
        <h3 className="filter-title">Filters</h3>
        {activeCount > 0 && (
          <span className="filter-count">{activeCount}</span>
        )}
      </div>

      {/* Active Filters Display */}
      {activeCount > 0 && (
        <div className="active-filters-section">
          <div className="active-filters-header">
            <h4 className="section-title-sm">Active Filters</h4>
            <button 
              className="btn-clear-all" 
              onClick={onClearFilters}
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      <div className="filter-sections">
        {/* Brand Filter */}
        <div className="filter-section">
          <h4 className="section-title">Brand</h4>
          <div className="filter-options">
            {['ACER', 'DELL', 'HP', 'LENOVO', 'APPLE', 'ASUS', 'MICROSOFT', 'MSI', 'Others'].map(brand => (
              <label key={brand} className="filter-checkbox">
                <input
                  type="checkbox"
                  value={brand}
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleCheckboxChange('brands', brand)}
                />
                <span className="checkbox-label">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="filter-section">
          <h4 className="section-title">Price Range</h4>
          <div className="price-filter">
            <div className="price-inputs">
              <div className="price-input-group">
                <label className="price-label">Min</label>
                <div className="price-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    className="price-input"
                    placeholder="0"
                    value={filters.minPrice || ''}
                    onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  />
                </div>
              </div>
              <div className="price-separator">-</div>
              <div className="price-input-group">
                <label className="price-label">Max</label>
                <div className="price-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    className="price-input"
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
        <div className="filter-section">
          <h4 className="section-title">Processor</h4>
          <div className="filter-options">
            {['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Apple M3'].map(processor => (
              <label key={processor} className="filter-checkbox">
                <input
                  type="checkbox"
                  value={processor}
                  checked={filters.processors.includes(processor)}
                  onChange={() => handleCheckboxChange('processors', processor)}
                />
                <span className="checkbox-label">{processor}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Generation Filter */}
        <div className="filter-section">
          <h4 className="section-title">Generation</h4>
          <div className="filter-options">
            {['10th', '11th', '12th', '13th', '14th', 'Latest'].map(gen => (
              <label key={gen} className="filter-checkbox">
                <input
                  type="checkbox"
                  value={gen}
                  checked={filters.generations.includes(gen)}
                  onChange={() => handleCheckboxChange('generations', gen)}
                />
                <span className="checkbox-label">{gen}</span>
              </label>
            ))}
          </div>
        </div>

        {/* RAM Filter */}
        <div className="filter-section">
          <h4 className="section-title">RAM</h4>
          <div className="filter-options">
            <div className="filter-grid">
              {['4GB', '8GB', '16GB', '32GB', '64GB'].map(ram => (
                <label key={ram} className="filter-chip">
                  <input
                    type="checkbox"
                    value={ram}
                    checked={filters.rams.includes(ram)}
                    onChange={() => handleCheckboxChange('rams', ram)}
                  />
                  <span className="chip-label">{ram}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Storage Type Filter */}
        <div className="filter-section">
          <h4 className="section-title">Storage Type</h4>
          <div className="filter-options">
            {['SSD', 'HDD', 'NVMe SSD', 'eMMC'].map(type => (
              <label key={type} className="filter-checkbox">
                <input
                  type="checkbox"
                  value={type}
                  checked={filters.storageTypes.includes(type)}
                  onChange={() => handleCheckboxChange('storageTypes', type)}
                />
                <span className="checkbox-label">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Storage Capacity Filter */}
        <div className="filter-section">
          <h4 className="section-title">Storage Capacity</h4>
          <div className="filter-options">
            <div className="filter-grid">
              {['128GB', '256GB', '512GB', '1TB', '2TB', '4TB+'].map(capacity => (
                <label key={capacity} className="filter-chip">
                  <input
                    type="checkbox"
                    value={capacity}
                    checked={filters.storageCapacities.includes(capacity)}
                    onChange={() => handleCheckboxChange('storageCapacities', capacity)}
                  />
                  <span className="chip-label">{capacity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Display Filter */}
        <div className="filter-section">
          <h4 className="section-title">Display</h4>
          <div className="filter-options">
            {['13.3"', '14"', '15.6"', '16"', '17.3"', 'Touchscreen', '2K', '4K', 'OLED'].map(display => (
              <label key={display} className="filter-checkbox">
                <input
                  type="checkbox"
                  value={display}
                  checked={filters.displays.includes(display)}
                  onChange={() => handleCheckboxChange('displays', display)}
                />
                <span className="checkbox-label">{display}</span>
              </label>
            ))}
          </div>
        </div>

        {/* OS Filter */}
        <div className="filter-section">
          <h4 className="section-title">Operating System</h4>
          <div className="filter-options">
            {['Windows 11', 'Windows 10', 'macOS', 'Chrome OS', 'Ubuntu', 'DOS'].map(os => (
              <label key={os} className="filter-checkbox">
                <input
                  type="checkbox"
                  value={os}
                  checked={filters.oses.includes(os)}
                  onChange={() => handleCheckboxChange('oses', os)}
                />
                <span className="checkbox-label">{os}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Weight Filter */}
        <div className="filter-section">
          <h4 className="section-title">Weight</h4>
          <div className="filter-options">
            {['Ultra-light (<1.5kg)', 'Light (1.5-2kg)', 'Standard (2-2.5kg)', 'Heavy (>2.5kg)'].map(weight => (
              <label key={weight} className="filter-checkbox">
                <input
                  type="checkbox"
                  value={weight}
                  checked={filters.weights.includes(weight)}
                  onChange={() => handleCheckboxChange('weights', weight)}
                />
                <span className="checkbox-label">{weight}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Condition Filter */}
        <div className="filter-section">
          <h4 className="section-title">Condition</h4>
          <div className="filter-options">
            <div className="filter-grid">
              {['New', 'Refurbished', 'Used'].map(condition => (
                <label key={condition} className="filter-chip">
                  <input
                    type="checkbox"
                    value={condition}
                    checked={filters.conditions.includes(condition)}
                    onChange={() => handleCheckboxChange('conditions', condition)}
                  />
                  <span className="chip-label">{condition}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Discount Filter */}
        <div className="filter-section">
          <h4 className="section-title">Discount</h4>
          <div className="filter-options">
            {['10% or more', '20% or more', '30% or more', '40% or more', '50% or more'].map(discount => (
              <label key={discount} className="filter-checkbox">
                <input
                  type="checkbox"
                  value={discount}
                  checked={filters.discounts.includes(discount)}
                  onChange={() => handleCheckboxChange('discounts', discount)}
                />
                <span className="checkbox-label">{discount}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ProductCard Component (simplified - notification handled in parent)
const ProductCard = ({ product, onAddToCart }) => {
  const calculateDiscount = () => {
    if (product.originalPrice && product.discountedPrice) {
      const discount = ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const discount = calculateDiscount();

  return (
    <div className="product">
      <div className="product-container">
        <div className="product-image">
          <img 
            src={product.imageUrl || '/api/placeholder/300/300'} 
            alt={product.name}
            loading="lazy"
          />
          {discount > 0 && (
            <div className="discount-badge">{discount}% OFF</div>
          )}
        </div>
        
        <div className="product-details">
          <h4>{product.name}</h4>
          
          <div className="price-section">
            {product.originalPrice && (
              <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
            )}
            <h3 className="discounted-price">₹{product.discountedPrice.toLocaleString()}</h3>
          </div>

          <ul className="specs-list">
            <li><strong>Processor:</strong> {product.processor}</li>
            <li><strong>RAM:</strong> {product.ram}</li>
            <li><strong>Storage:</strong> {product.storage}</li>
            <li><strong>Display:</strong> {product.display}</li>
            <li><strong>OS:</strong> {product.os}</li>
          </ul>

          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="cart-icon" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main FilterLaptops Component
const FilterLaptops = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brands: [],
    minPrice: '',
    maxPrice: '',
    processors: [],
    generations: [],
    rams: [],
    storageTypes: [],
    storageCapacities: [],
    displays: [],
    oses: [],
    weights: [],
    conditions: [],
    discounts: []
  });
  
  const [cartItem, setCartItem] = useState(null);
  const navigate = useNavigate();
  const { updateCart } = useCart();

  // Load filters from URL on component mount
  useEffect(() => {
    const urlFilters = {};
    const filterKeys = [
      'brands', 'processors', 'generations', 'rams', 'storageTypes', 
      'storageCapacities', 'displays', 'oses', 'weights', 'conditions', 'discounts'
    ];
    
    filterKeys.forEach(key => {
      const value = searchParams.get(key);
      if (value) {
        urlFilters[key] = value.split(',');
      } else {
        urlFilters[key] = [];
      }
    });

    // Handle price filters
    urlFilters.minPrice = searchParams.get('minPrice') || '';
    urlFilters.maxPrice = searchParams.get('maxPrice') || '';

    setFilters(urlFilters);
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(','));
      } else if (value && !Array.isArray(value)) {
        params.set(key, value.toString());
      }
    });

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Fetch products (simulated)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API call
        const mockProducts = [
          {
            id: 1,
            name: 'Dell XPS 13 Laptop',
            processor: 'Intel Core i7',
            ram: '16GB',
            storage: '512GB SSD',
            display: '13.4" FHD+',
            os: 'Windows 11',
            originalPrice: 129999,
            discountedPrice: 109999,
            imageUrl: '/api/placeholder/300/300',
            brand: 'DELL',
            generation: '13th',
            storageType: 'SSD',
            storageCapacity: '512GB',
            weight: 'Ultra-light (<1.5kg)',
            condition: 'New'
          },
          {
            id: 2,
            name: 'MacBook Air M2',
            processor: 'Apple M2',
            ram: '8GB',
            storage: '256GB SSD',
            display: '13.6" Liquid Retina',
            os: 'macOS',
            originalPrice: 114999,
            discountedPrice: 99999,
            imageUrl: '/api/placeholder/300/300',
            brand: 'APPLE',
            generation: 'Latest',
            storageType: 'SSD',
            storageCapacity: '256GB',
            weight: 'Ultra-light (<1.5kg)',
            condition: 'New'
          },
          {
            id: 3,
            name: 'HP Spectre x360',
            processor: 'Intel Core i5',
            ram: '8GB',
            storage: '512GB SSD',
            display: '13.5" OLED',
            os: 'Windows 11',
            originalPrice: 89999,
            discountedPrice: 74999,
            imageUrl: '/api/placeholder/300/300',
            brand: 'HP',
            generation: '12th',
            storageType: 'SSD',
            storageCapacity: '512GB',
            weight: 'Light (1.5-2kg)',
            condition: 'Refurbished'
          },
        ];
        
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters to products
  useEffect(() => {
    if (products.length === 0) return;

    const filtered = products.filter(product => {
      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      // Price filter
      if (filters.minPrice && product.discountedPrice < parseInt(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && product.discountedPrice > parseInt(filters.maxPrice)) {
        return false;
      }

      // Processor filter
      if (filters.processors.length > 0 && !filters.processors.some(proc => 
        product.processor.toLowerCase().includes(proc.toLowerCase()))) {
        return false;
      }

      // RAM filter
      if (filters.rams.length > 0 && !filters.rams.includes(product.ram)) {
        return false;
      }

      // Storage type filter
      if (filters.storageTypes.length > 0 && !filters.storageTypes.includes(product.storageType)) {
        return false;
      }

      // Storage capacity filter
      if (filters.storageCapacities.length > 0 && !filters.storageCapacities.includes(product.storageCapacity)) {
        return false;
      }

      // Condition filter
      if (filters.conditions.length > 0 && !filters.conditions.includes(product.condition)) {
        return false;
      }

      return true;
    });

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      
      if (Array.isArray(currentValues)) {
        const updatedValues = currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value];
        
        return { ...prev, [filterType]: updatedValues };
      }
      
      return { ...prev, [filterType]: value };
    });
  };

  const handleClearFilters = () => {
    setFilters({
      brands: [],
      minPrice: '',
      maxPrice: '',
      processors: [],
      generations: [],
      rams: [],
      storageTypes: [],
      storageCapacities: [],
      displays: [],
      oses: [],
      weights: [],
      conditions: [],
      discounts: []
    });
  };

  // ✅ Updated addToCart with proper authentication and cart functionality (same as phones page)
  const addToCart = async (laptop) => {
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
        updatedCart = [...currentCart, {
          id: laptop.id,
          name: laptop.name,
          brand: laptop.brand,
          processor: laptop.processor,
          ram: laptop.ram,
          storage: laptop.storage,
          display: laptop.display,
          os: laptop.os,
          image: laptop.imageUrl,
          price: laptop.discountedPrice,
          originalPrice: laptop.originalPrice,
          discount: calculateDiscount(laptop),
          quantity: 1,
          type: 'laptop'
        }];
      }

      // ✅ Save to localStorage immediately after updating the cart
      localStorage.setItem(userCartKey, JSON.stringify(updatedCart));

      // Update the context
      updateCart(updatedCart, userId);

      // Keep the UI feedback (same as phones page)
      setCartItem(`${laptop.name} added to cart!`);
      setTimeout(() => setCartItem(null), 3000);

    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Fallback: Add to cart without authentication but prompt login
      navigate('/sign-in');
      setCartItem(`${laptop.name} added to cart! (Please log in to sync)`);
      setTimeout(() => setCartItem(null), 3000);
    }
  };

  const calculateDiscount = (laptop) => {
    if (laptop.originalPrice && laptop.discountedPrice) {
      const discount = ((laptop.originalPrice - laptop.discountedPrice) / laptop.originalPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="loading">Loading laptops...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Cart Message - Same as phones page */}
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
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Laptop
          </h1>
          <p className="text-gray-600">
            Filter through our collection of premium laptops
          </p>
        </div>

        <div className="page-container">
          <LaptopFilter 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
          
          <div className="products-section">
            {filteredProducts.length > 0 ? (
              <div className="products">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <h3>No laptops found</h3>
                <p>
                  Try adjusting your filters or{' '}
                  <button 
                    className="clear-all-inline"
                    onClick={handleClearFilters}
                  >
                    clear all filters
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FilterLaptops;