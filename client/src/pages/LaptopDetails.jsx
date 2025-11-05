// client/src/pages/LaptopDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContent';
import { ShoppingCart, Zap, Shield, Award, Truck, Check, X } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import './LaptopDetails.css';

const LaptopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateCart } = useCart();
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItem, setCartItem] = useState(null);

  useEffect(() => {
    const fetchLaptopDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/laptops/${id}`);
        
        if (!response.ok) {
          throw new Error('Laptop not found');
        }
        
        const laptopData = await response.json();
        setLaptop(laptopData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching laptop details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptopDetails();
  }, [id]);

  const calculateFinalPrice = (laptop) => {
    const price = parseFloat(laptop.pricing.basePrice || 0);
    const discount = parseFloat(laptop.pricing.discount || 0);
    return Number((price - (price * discount / 100)).toFixed(2));
  };

  const addToCart = async () => {
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

  const buyNow = async () => {
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

      if (!laptop || !laptop.id) {
        console.error('Laptop data not available');
        return;
      }

      // Calculate price locally
      const finalPrice = calculateFinalPrice(laptop);

      const paymentData = {
        price: finalPrice,
        type: 'laptop',
        id: id,
        laptop: laptop,
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
      <>
        <Header />
        <div className="container">
          <div className="loading">Loading laptop details...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="error-page">
            <h2>Laptop Not Found</h2>
            <p>{error}</p>
            <Link to="/filter-buy-laptop" className="btn btn-primary">
              Back to Laptops
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!laptop) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="error-page">
            <h2>Laptop Not Found</h2>
            <Link to="/filter-buy-laptop" className="btn btn-primary">
              Back to Laptops
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const finalPrice = calculateFinalPrice(laptop);
  const originalPrice = laptop.pricing.basePrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      
      {/* Cart Success Message */}
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

      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/filter-buy-laptop" className="text-blue-600 hover:text-blue-800">Laptops</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{laptop.brand} {laptop.series}</span>
        </nav>

        {/* Product Details */}
        <div className="product-details-container">
          <div className="product-image-section">
            <div className="product-image">
              <img 
                src={laptop.image} 
                alt={`${laptop.brand} ${laptop.series}`}
                className="w-full h-full object-contain"
              />
              <div className="condition-badge">
                {laptop.condition}
              </div>
            </div>
          </div>

          <div className="product-info-section">
            <h1 className="product-title">{laptop.brand} {laptop.series}</h1>
            <span className="product-condition">{laptop.condition} Condition</span>
            
            <div className="price-container">
              <span className="final-price">₹{finalPrice.toLocaleString('en-IN')}</span>
              <span className="original-price">₹{originalPrice.toLocaleString('en-IN')}</span>
              <span className="discount-badge">{laptop.pricing.discount}% OFF</span>
            </div>

            <div className="product-actions">
              <button 
                className="btn btn-primary"
                onClick={addToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button 
                className="btn btn-secondary"
                onClick={buyNow}
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </button>
            </div>

            <div className="features-grid">
              <div className="feature-item">
                <Shield className="w-6 h-6 text-green-600" />
                <span>6 Month Warranty</span>
              </div>
              <div className="feature-item">
                <Truck className="w-6 h-6 text-blue-600" />
                <span>Free Shipping</span>
              </div>
              <div className="feature-item">
                <Award className="w-6 h-6 text-purple-600" />
                <span>Quality Certified</span>
              </div>
            </div>

            <div className="specifications">
              <h3>Key Specifications</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <strong>Processor:</strong> {laptop.processor.name} {laptop.processor.generation}
                </div>
                <div className="spec-item">
                  <strong>Display:</strong> {laptop.displaysize}"
                </div>
                <div className="spec-item">
                  <strong>OS:</strong> {laptop.os}
                </div>
                <div className="spec-item">
                  <strong>Weight:</strong> {laptop.weight} kg
                </div>
                <div className="spec-item">
                  <strong>RAM:</strong> {laptop.memory.ram}
                </div>
                <div className="spec-item">
                  <strong>Storage:</strong> {laptop.memory.storage.type} {laptop.memory.storage.capacity}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="product-description">
          <h2>Product Description</h2>
          <p>
            Experience the power and performance of the {laptop.brand} {laptop.series}. 
            This {laptop.condition.toLowerCase()} condition laptop features {laptop.processor.name} {laptop.processor.generation} processor, 
            {laptop.memory.ram} RAM and {laptop.memory.storage.type} {laptop.memory.storage.capacity} storage, 
            making it perfect for multitasking and all your computing needs.
          </p>

          <div className="highlight-features">
            <h3>Highlight Features</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h4>Powerful Performance</h4>
                <p>{laptop.processor.name} {laptop.processor.generation} Processor</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🖥️</div>
                <h4>Stunning Display</h4>
                <p>{laptop.displaysize}" Display</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h4>Fast Storage</h4>
                <p>{laptop.memory.storage.type} {laptop.memory.storage.capacity}</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💼</div>
                <h4>Portable Design</h4>
                <p>Only {laptop.weight} kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LaptopDetails;