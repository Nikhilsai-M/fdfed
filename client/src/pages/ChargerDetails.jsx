// ChargerDetails.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductActions from '../components/ProductActions';
import ProductSidebar from '../components/ProductSideBar';
import ProductImage from '../components/ProductImage';
import ProductContent from '../components/ProductContent';
import CartMessage from '../components/CartMessage';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const ChargerDetails = () => {
  const { id } = useParams(); // id from URL, e.g., /chargers/123
  const [charger, setCharger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Update cart count in header (assuming a global callback or Header component listens to localStorage changes)
  const updateCartCount = (currentCart) => {
    const totalItems = currentCart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
      cartCountElement.classList.toggle('hidden', totalItems === 0);
      cartCountElement.textContent = totalItems;
    }
  };

  // Fetch charger details
  useEffect(() => {
    const fetchCharger = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error on retry
        const response = await fetch(`/api/Accessories/chargers/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response: Not JSON');
        }
        const data = await response.json();
        // Validate data shape
        if (!data || !data.id) {
          throw new Error('Invalid charger data: Missing ID');
        }
        setCharger(data);
      } catch (err) {
        console.error('Fetch error:', err); // Log for debugging
        setError(err.message);
        setCharger(null); // Ensure null on error
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCharger();
    } else {
      setError('No charger ID provided');
      setLoading(false);
    }
  }, [id]);

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
    const session = JSON.parse(localStorage.getItem('currentSession'));
    if (!session || !session.loggedIn) {
      navigate('/login');
      return;
    }

    if (!charger || !charger.id) { // Extra safety check
      setError('Charger data not available');
      return;
    }

    try {
      const chargerData = charger;

      const userId = session.userId;
      const userCartKey = `cart_${userId}`;
      const currentCart = JSON.parse(localStorage.getItem(userCartKey)) || [...cart];

      const existingChargerIndex = currentCart.findIndex((item) => item.id === chargerData.id);

      let updatedCart;
      if (existingChargerIndex !== -1) {
        updatedCart = [...currentCart];
        updatedCart[existingChargerIndex].quantity += 1;
      } else {
        updatedCart = [
          ...currentCart,
          {
            id: chargerData.id,
            brand: chargerData.brand,
            title: chargerData.title,
            wattage: chargerData.wattage,
            type: chargerData.type,
            outputCurrent: chargerData.outputCurrent,
            image: chargerData.image,
            price: chargerData.pricing.originalPrice,
            discount: parseFloat(chargerData.pricing.discount),
            quantity: 1,
          },
        ];
      }

      localStorage.setItem(userCartKey, JSON.stringify(updatedCart));
      setCart(updatedCart);
      updateCartCount(updatedCart);

      setCartMessage(`${chargerData.title} added to cart!`);
      setTimeout(() => setCartMessage(null), 3500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartMessage(`${charger?.title || 'Item'} added to cart!`);
      setTimeout(() => setCartMessage(null), 3500);
    }
  };

  const buyNow = () => {
    const session = JSON.parse(localStorage.getItem('currentSession'));
    if (!session || !session.loggedIn) {
      navigate('/login');
      return;
    }
    if (!id) { // Safety for URL param
      setError('No charger ID available');
      return;
    }
    setTimeout(() => {
      navigate(`/buy/charger/${id}`);
    }, 500);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600 animate-pulse">Loading charger details...</div>
      </div>
    );
  }

  // Error or no data state (strengthened guard)
  if (error || !charger || !charger.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-2">{error || 'Charger not found'}</div>
          <button
            onClick={() => window.location.reload()} // Retry fetch
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
      {/* Assuming Header and Footer are separate components */}
      {/* <Header /> */}
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 animate-fade-in">
          <ProductImage charger={charger} />
          <div className="space-y-6">
            <ProductSidebar charger={charger} />
            <ProductActions 
              onAddToCart={addToCart}
              onBuyNow={buyNow}
              chargerId={charger.id} // Safe now due to guard
            />
          </div>
        </div>

        <ProductContent charger={charger} />
      </div>

      {/* Cart Message */}
      {cartMessage && (
        <CartMessage 
          message={cartMessage} 
          onClose={() => setCartMessage(null)} 
        />
      )}

      {/* Assuming Footer component */}
      {/* <Footer /> */}
      <Footer />
    </div>
  );
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

// In your main CSS file (e.g., index.css), add the styles above or configure in tailwind.config.js under extend.theme.animation

export default ChargerDetails;