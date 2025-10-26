import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, TrendingUp, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
const AccessoriesPage = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState(null);

  const carouselImages = [
    'src/assets/images/carousal/accessories/acc-1.webp',
    'src/assets/images/carousal/accessories/acc-2.jpeg',
    'src/assets/images/carousal/accessories/acc-3.jpeg',
    'src/assets/images/carousal/accessories/acc-4.webp'
  ];

  const categories = [
    { name: 'Chargers', icon: 'src/assets/images/icons/charger.jpg', link: '/chargers' },
    { name: 'Earbuds', icon: 'src/assets/images/icons/Ear buds.png', link: '/earphones' },
    { name: 'Mouses', icon: 'src/assets/images/icons/mouse.jpg', link: '/mouses' },
    { name: 'SmartWatches', icon: 'src/assets/images/icons/Smart watch.jpg', link: '/smartwatches' }
  ];

  const features = [
    { icon: Star, title: 'Premium Quality', desc: 'Top-rated accessories' },
    { icon: Shield, title: 'Warranty', desc: 'Protected purchases' },
    { icon: Zap, title: 'Fast Delivery', desc: 'Quick shipping' },
    { icon: TrendingUp, title: 'Best Prices', desc: 'Competitive rates' }
  ];

  useEffect(() => {
    fetchAccessories();
    const interval = setInterval(fetchAccessories, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchAccessories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/latest-accessories');
      if (!response.ok) throw new Error('Failed to fetch accessories');
      const data = await response.json();
      setAccessories(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching accessories:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalPrice = (product) => {
    const price = parseFloat(product.base_price || 0);
    const discount = parseFloat(product.discount || 0);
    return Number((price - (price * discount / 100)).toFixed(2));
  };

  const getAccessorySpecs = (accessory) => {
    const specs = [];
    if (accessory.type === 'charger' && accessory.specs?.wattage) {
      specs.push({ label: 'Wattage', value: accessory.specs.wattage });
    }
    if (accessory.type === 'earphone' && accessory.specs?.battery_life) {
      specs.push({ label: 'Battery Life', value: accessory.specs.battery_life });
    }
    if (accessory.type === 'mouse' && accessory.specs?.connectivity) {
      specs.push({ label: 'Connectivity', value: accessory.specs.connectivity });
    }
    if (accessory.type === 'smartwatch') {
      if (accessory.specs?.display_size) {
        specs.push({ label: 'Display Size', value: accessory.specs.display_size });
      }
      if (accessory.specs?.battery_life) {
        specs.push({ label: 'Battery Life', value: accessory.specs.battery_life });
      }
    }
    return specs;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Spacer for header */}
      <div className="h-4"></div>
      
      {/* Carousel Section */}
      <div className="container mx-auto px-8 pt-8 md:pt-14 pb-10">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl group bg-gray-200">
          {/* Carousel Track */}
          <div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px]">
            {carouselImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img 
                  src={img} 
                  alt={`Accessory ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-4 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5 md:w-7 md:h-7 text-gray-800" />
          </button>
          <button 
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-4 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5 md:w-7 md:h-7 text-gray-800" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'w-8 md:w-10 bg-white shadow-lg' : 'w-2 md:w-2.5 bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
            {currentSlide + 1} / {carouselImages.length}
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-2">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm text-center">{feature.title}</h3>
                <p className="text-xs text-gray-600 text-center">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800">
          Browse by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Category</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="group flex flex-col items-center p-4 md:p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mb-3 md:mb-4 overflow-hidden rounded-full bg-gradient-to-br from-blue-50 to-purple-50 p-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <img 
                  src={category.icon} 
                  alt={category.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-gray-800 font-semibold text-center text-sm md:text-base group-hover:text-blue-600 transition-colors duration-300">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Newly Added Accessories Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fadeIn">
            Newly Added Accessories
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Discover our latest collection of premium accessories with exclusive discounts
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-12 animate-fadeIn">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading accessories...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 text-lg font-semibold mb-2">Oops! Something went wrong</p>
              <p className="text-gray-600">Unable to load accessories. Please try again later.</p>
            </div>
          ) : accessories.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg">No new accessories available at the moment.</p>
              <p className="text-gray-500 text-sm mt-2">Check back soon for exciting new products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {accessories.map((accessory, index) => {
                const finalPrice = calculateFinalPrice(accessory);
                const originalPrice = accessory.base_price;
                const specs = getAccessorySpecs(accessory);
                
                return (
                  <a
                    key={accessory.id}
                    href={`/${accessory.type}/${accessory.id}`}
                    className="group block bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fadeInUp"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <img 
                        src={accessory.image} 
                        alt={`${accessory.brand} ${accessory.title}`}
                        className="w-full h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs md:text-sm font-bold shadow-lg">
                        {accessory.discount}% OFF
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="p-4 md:p-5">
                      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {accessory.brand} {accessory.title}
                      </h3>
                      
                      <div className="flex items-baseline gap-2 md:gap-3 mb-3">
                        <span className="text-xl md:text-2xl font-bold text-gray-900">
                          ₹{finalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs md:text-sm text-gray-500 line-through">
                          ₹{originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-xs md:text-sm text-gray-600 border-t pt-3">
                        {specs.map((spec, idx) => (
                          <p key={idx} className="flex justify-between">
                            <span className="font-semibold text-gray-700">{spec.label}:</span>
                            <span className="text-right">{spec.value}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        * {
          scroll-behavior: smooth;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AccessoriesPage;