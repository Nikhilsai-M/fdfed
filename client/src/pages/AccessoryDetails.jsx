import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import ProductSidebar from '../components/ProductSideBar';
import ProductImage from '../components/ProductImage';
import ProductContent from '../components/ProductContent';
import ProductActions from '../components/ProductActions';
import CartMessage from '../components/CartMessage';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

import { useCart } from '../context/CartContent';

const AccessoryDetails = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);

  const { updateCart } = useCart();

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

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(getApiEndpoint());
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const data = await response.json();
        if (!data || !data.id) throw new Error(`Invalid ${type} data`);
        setProduct(data);
      } catch (err) {
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id && type) fetchProduct();
  }, [id, type]);

  // Add to Cart using Context
  const addToCart = async () => {
    try {
      const response = await fetch('/api/user/profile', { method: 'GET', credentials: 'include' });
      if (!response.ok) {
        navigate('/sign-in');
        return;
      }

      const userData = await response.json();
      const userId = userData?.user?.user_id;
      if (!userId) {
        navigate('/sign-in');
        return;
      }

      const cartKey = `cart_user_${userId}`;
      const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];

      const existingIndex = existingCart.findIndex((item) => item.id === product.id);
      let updatedCart;
      if (existingIndex !== -1) {
        updatedCart = [...existingCart];
        updatedCart[existingIndex].quantity += 1;
      } else {
        updatedCart = [...existingCart, getCartItemFields(product)];
      }

      updateCart(updatedCart, userId);

      setCartMessage(`${product.title} added to cart!`);
      setTimeout(() => setCartMessage(null), 3500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      navigate('/sign-in');
    }
  };

  const buyNow = async () => {
    try {
      const response = await fetch('/api/user/profile', { credentials: 'include' });
      if (!response.ok) {
        navigate('/sign-in');
        return;
      }

      const userData = await response.json();
      const userId = userData?.user?.user_id;
      
      if (!userId) {
        navigate('/sign-in');
        return;
      }

      // Calculate price locally
      const basePrice = product.pricing.originalPrice || product.pricing.basePrice;
      const finalPrice = parseFloat(basePrice) - parseFloat(basePrice) * (parseFloat(product.pricing.discount) / 100);

      const paymentData = {
        price: finalPrice,
        type: type,
        id: id,
        accessory: product,
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600 animate-pulse">Loading {type} details...</div>
      </div>
    );
  }

  if (error || !product || !product.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-2">{error || `${type} not found`}</div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-fade-in">
          <ProductImage image={product.image} brand={product.brand} title={product.title} />
          <div className="space-y-6">
            <ProductSidebar product={product} type={type} />
          </div>
        </div>

        <div className="mb-12 w-full">
          <ProductActions
            onAddToCart={addToCart}
            onBuyNow={buyNow}
            productId={product.id}
          />
        </div>

        <ProductContent product={product} type={type} />
      </div>

      {cartMessage && (
        <CartMessage message={cartMessage} onClose={() => setCartMessage(null)} />
      )}

      <Footer />
    </div>
  );
};

AccessoryDetails.propTypes = {
  type: PropTypes.oneOf(['charger', 'mouse', 'smartwatch', 'earphone']).isRequired,
};

export default AccessoryDetails;