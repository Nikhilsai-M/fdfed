// AccessoryDetails.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ProductSidebar from '../components/ProductSideBar';
import ProductImage from '../components/ProductImage';
import ProductContent from '../components/ProductContent';
import CartMessage from '../components/CartMessage'; // Ensure this import is correct

import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProductActions from '../components/ProductActions';

const AccessoryDetails = ({ type }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Dynamic API endpoint based on type
  const getApiEndpoint = () => {
    switch (type) {
      case 'charger': return `/api/Accessories/chargers/${id}`;
      case 'mouse': return `/api/Accessories/mouses/${id}`;
      case 'smartwatch': return `/api/Accessories/smartwatches/${id}`;
      case 'earphone': return `/api/Accessories/earphones/${id}`;
      default: return '';
    }
  };

  // Dynamic buy route based on type
  const getBuyRoute = () => {
    switch (type) {
      case 'charger': return `/buy/charger/${id}`;
      case 'mouse': return `/buy/mouse/${id}`;
      case 'smartwatch': return `/buy/smartwatch/${id}`;
      case 'earphone': return `/buy/earphone/${id}`;
      default: return '';
    }
  };

  // Dynamic cart item fields based on type
  const getCartItemFields = (productData) => {
    const base = {
      id: productData.id,
      brand: productData.brand,
      title: productData.title,
      image: productData.image,
      price: productData.pricing.originalPrice,
      discount: parseFloat(productData.pricing.discount),
      quantity: 1,
    };
    switch (type) {
      case 'charger':
        return { ...base, wattage: productData.wattage, type: productData.type, outputCurrent: productData.outputCurrent };
      case 'mouse':
        return { ...base, connectivity: productData.connectivity, resolution: productData.resolution, type: productData.type };
      case 'smartwatch':
        return { ...base, displaySize: productData.displaySize, displayType: productData.displayType, batteryRuntime: productData.batteryRuntime };
      case 'earphone':
        return { ...base, design: productData.design, batteryLife: productData.batteryLife };
      default:
        return base;
    }
  };

  // Update cart count in header
  const updateCartCount = (currentCart) => {
    const totalItems = currentCart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
      cartCountElement.classList.toggle('hidden', totalItems === 0);
      cartCountElement.textContent = totalItems;
    }
  };

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(getApiEndpoint());
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response: Not JSON');
        }
        const data = await response.json();
        if (!data || !data.id) {
          throw new Error(`Invalid ${type} data: Missing ID`);
        }
        setProduct(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id && type) {
      fetchProduct();
    } else {
      setError('No ID or type provided');
      setLoading(false);
    }
  }, [id, type]);

  // Load cart on mount
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('currentSession'));
    if (session && session.loggedIn) {
      const userId = session.userId;
      const userCartKey = `cart_${userId}`;
      const loadedCart = JSON.parse(localStorage.getItem(userCartKey)) || [];
      setCart(loadedCart);
      updateCartCount(loadedCart);
    }
  }, []);

  const addToCart = async () => {
  try {
    // Verify user session via API (sends JWT cookie automatically with credentials: 'include')
    const response = await fetch('/api/user/profile', {
      method: 'GET',
      credentials: 'include', // Includes the httpOnly JWT cookie
    });

    if (!response.ok) {
      // Not logged in or token invalid/expired
      navigate('/sign-in');
      return;
    }

    const userData = await response.json();
    if (!userData.success || !userData.user) {
      navigate('/sign-in');
      return;
    }

    const userId = userData.user.user_id; // From backend response
    const userCartKey = `cart_${userId}`;

    if (!product || !product.id) {
      setError(`${type.charAt(0).toUpperCase() + type.slice(1)} data not available`);
      return;
    }

    const productData = product;
    let currentCart = JSON.parse(localStorage.getItem(userCartKey)) || [];

    const existingIndex = currentCart.findIndex((item) => item.id === productData.id);

    let updatedCart;
    if (existingIndex !== -1) {
      updatedCart = [...currentCart];
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart = [...currentCart, getCartItemFields(productData)];
    }

    localStorage.setItem(userCartKey, JSON.stringify(updatedCart));
    setCart(updatedCart);
    updateCartCount(updatedCart);

    setCartMessage(`${productData.title} added to cart!`);
    setTimeout(() => setCartMessage(null), 3500);
  } catch (error) {
    console.error('Error adding to cart:', error);
    // If API call fails (e.g., network), fallback to login redirect
    navigate('/sign-in');
    setCartMessage(`${product?.title || 'Item'} added to cart! (Please log in to sync)`);
    setTimeout(() => setCartMessage(null), 3500);
  }
};

  
  const buyNow = async () => {
  try {
    const response = await fetch('/api/user/profile', { credentials: 'include' });
    if (!response.ok) {
      navigate('/sign-in');
      return;
    }
    // Proceed...
    setTimeout(() => navigate(getBuyRoute()), 500);
  } catch (error) {
    navigate('/sign-in');
  }
};

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600 animate-pulse">Loading {type} details...</div>
      </div>
    );
  }

  // Error or no data state
  if (error || !product || !product.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-2">{error || `${type.charAt(0).toUpperCase() + type.slice(1)} not found`}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Product Details Grid (Image and Sidebar side-by-side) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-fade-in">
          <ProductImage image={product.image} brand={product.brand} title={product.title} />
          <div className="space-y-6">
            <ProductSidebar product={product} type={type} />
          </div>
        </div>

        {/* Product Actions (Buttons - Full width below the grid/specs) */}
        <div className="mb-12 w-full">
          <ProductActions 
            onAddToCart={addToCart}
            onBuyNow={buyNow}
            productId={product.id}
          />
        </div>

        <ProductContent product={product} type={type} />
      </div>

      {/* Cart Message */}
      {cartMessage && (
        <CartMessage 
          message={cartMessage} 
          onClose={() => setCartMessage(null)} 
        />
      )}

      <Footer />
    </div>
  );
};

AccessoryDetails.propTypes = {
  type: PropTypes.oneOf(['charger', 'mouse', 'smartwatch', 'earphone']).isRequired,
};

// Custom Tailwind animations (add to your globals.css or Tailwind config)
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-in-right {
    from { opacity: 0; transform: translateX(100%); }
    to { opacity: 1; transform: translateX(0); }
  }
  .animate-fade-in { animation: fade-in 0.6s ease-out; }
  .animate-slide-up { animation: slide-up 0.8s ease-out; }
  .animate-slide-in-right { animation: slide-in-right 0.5s ease-out; }
  .fade-in { animation: fade-in 0.3s ease-in; }
`;

export default AccessoryDetails;