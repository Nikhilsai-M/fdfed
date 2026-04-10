// client/src/pages/LaptopDetails.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import ProductSidebar from '../components/ProductSideBar';
import ProductImage from '../components/ProductImage';
import ProductContent from '../components/ProductContent';
import ProductActions from '../components/ProductActions';
import CartMessage from '../components/CartMessage';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useCart } from '../context/CartContent';

const LaptopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);

  const { addItem } = useCart();

  // Fetch laptop details
  useEffect(() => {
    const fetchLaptop = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/laptops/${id}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const data = await response.json();
        if (!data || !data.id) throw new Error('Invalid laptop data');
        setLaptop(data);
      } catch (err) {
        setError(err.message);
        setLaptop(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLaptop();
  }, [id]);

  const getCartItemFields = (laptopData) => {
    const basePrice = parseFloat(laptopData.pricing?.basePrice || 0);
    const discountPercentage = parseFloat(laptopData.pricing?.discount || 0);
  
    // Calculate final discount price
    const discountPrice = basePrice - basePrice * (discountPercentage / 100);
  
    return {
      id: laptopData.id,
      brand: laptopData.brand,
      title: `${laptopData.brand} ${laptopData.series}`,
      model: laptopData.series,
      image: laptopData.image,
  
      // Store original + discount values so Cart.jsx can read them
      price: basePrice, // Original price
      discountPercentage: discountPercentage, // % off
      discountPrice: Number(discountPrice.toFixed(2)), // Discounted Price
  
      ram: laptopData.ram,
      storage: `${laptopData.storage_type} ${laptopData.storage_capacity}`,
      processor: `${laptopData.processor_name} ${laptopData.processor_generation || ''}`.trim(),
      display: `${laptopData.display_size}"`,
      os: laptopData.os,
      weight: `${laptopData.weight} kg`,
      condition: laptopData.condition,
  
      quantity: 1,
      type: 'laptop',
    };
  };
  

  // Add to Cart using Context
  const addToCart = async () => {
    try {
      await addItem('laptop', laptop.id, 1);
      setCartMessage(`${laptop.brand} ${laptop.series} added to cart!`);
      setTimeout(() => setCartMessage(null), 3500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (/unauthorized|forbidden/i.test(error.message || '')) {
        navigate('/sign-in');
        return;
      }
      alert(error.message || 'Failed to add item to cart');
    }
  };

  // Buy Now function - SAME as FilterLaptops page  // Buy Now function - SAME as FilterLaptops page
  const buyNow = async () => {
    try {
      console.log('Buy Now clicked for laptop:', laptop);
      
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

      // Calculate price locally - SAME calculation as FilterLaptops
      const calculateFinalPrice = (laptopData) => {
        const price = parseFloat(laptopData.pricing.basePrice || 0);
        const discount = parseFloat(laptopData.pricing.discount || 0);
        return Number((price - (price * discount / 100)).toFixed(2));
      };

      const finalPrice = calculateFinalPrice(laptop);

      console.log('Buy Now - Price details:', { 
        basePrice: laptop.pricing.basePrice, 
        discount: laptop.pricing.discount, 
        finalPrice,
        laptopId: laptop.id 
      });

      const paymentData = {
        price: finalPrice,
        type: 'laptop',
        id: laptop.id,
        laptop: laptop,
        userId: userId,
      };

      // Navigate to frontend payment page - SAME as FilterLaptops
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
        <div className="text-lg text-gray-600 animate-pulse">Loading laptop details...</div>
      </div>
    );
  }

  if (error || !laptop || !laptop.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-2">{error || 'Laptop not found'}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Retry
          </button>
          <Link
            to="/filter-buy-laptop"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Laptops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-24">
        <nav className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/filter-buy-laptop" className="text-blue-600 hover:text-blue-800">Laptops</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{laptop.brand} {laptop.series}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-fade-in">
          <ProductImage 
            image={laptop.image} 
            alt={`${laptop.brand} ${laptop.series}`} 
            condition={laptop.condition}
          />
          <div className="space-y-6">
            <ProductSidebar product={laptop} type="laptop" />
          </div>
        </div>

        <div className="mb-12 w-full">
          <ProductActions
            onAddToCart={addToCart}
            onBuyNow={buyNow}
            productId={laptop.id}
          />
        </div>

        <ProductContent product={laptop} type="laptop" />
      </div>

      {cartMessage && (
        <CartMessage message={cartMessage} onClose={() => setCartMessage(null)} />
      )}

      <Footer />
    </div>
  );
};

export default LaptopDetails;

