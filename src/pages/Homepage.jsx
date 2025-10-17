import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await fetch('/api/latest-phones');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLatestProducts();
    const interval = setInterval(fetchLatestProducts, 30000);
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 2000);
    return () => {
      clearInterval(interval);
      clearInterval(slideInterval);
    };
  }, []);

  const calculateFinalPrice = (product) => {
    const price = parseFloat(product.base_price || 0);
    const discount = parseFloat(product.discount || 0);
    return Number((price - (price * discount / 100)).toFixed(2));
  };

  const redirectToFilterPage = (brand) => {
    window.location.href = `/filter-buy-phone?brand=${brand}`;
  };

  const slides = [
    '/images/carousal/home/pic-1.jpeg',
    '/images/carousal/home/pic-2.jpeg',
    '/images/carousal/home/pic-3.jpeg',
    '/images/carousal/home/pic-4.jpeg',
  ];
  const slideLinks = ['', '', '/Accessories', '/buy-phone'];

  return (
    <div className="pt-32 bg-gray-100 min-h-screen animate-fadeInUp">
      <div className="relative w-[95vw] mx-auto rounded-2xl overflow-hidden shadow-lg">
        <div className="relative w-full h-96">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: `url(${slide})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              {slideLinks[index] && (
                <a href={slideLinks[index]} className="block w-full h-full"></a>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + 4) % 4)}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-500 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300 animate-pulseSlow"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % 4)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-500 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300 animate-pulseSlow"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <h2 className="text-2xl font-bold ml-6 mt-8 mb-4 animate-bounceIn">Newly Added Products</h2>
      <div className="bg-gray-200 p-5 overflow-x-auto animate-slideInRight">
        <div className="flex gap-5 min-w-max">
          {products.length === 0 ? (
            <p>No new products available.</p>
          ) : (
            products.map((product, index) => {
              const finalPrice = calculateFinalPrice(product);
              return (
                <div key={product.id} className="bg-white p-4 rounded-lg shadow-md min-w-[250px] transition-transform duration-300 hover:scale-105 hover:shadow-xl animate-fadeInUp delay-[${index * 100}ms]">
                  <a href={`/product/${product.id}`} className="block text-black no-underline">
                    <img src={product.image} alt={`${product.brand} ${product.model}`} className="w-4/5 h-48 mx-auto mb-4 rounded-md transition-transform duration-300 hover:scale-110" />
                    <p className="font-bold">{product.brand} {product.model}</p>
                    <p className="text-lg font-bold">₹{finalPrice.toLocaleString('en-IN')} <span className="line-through text-gray-500 text-sm">₹{product.base_price.toLocaleString('en-IN')}</span></p>
                    <p className="text-green-600 font-bold">{product.discount}% off</p>
                    <p>Grade: {product.condition}</p>
                    <p>FREE 6 Months Warranty</p>
                  </a>
                </div>
              );
            })
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold ml-6 mt-8 mb-4 animate-bounceIn">Top Brands</h2>
      <div className="bg-gray-100 p-8 animate-slideInRight">
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { brand: 'Apple', img: '/images/topbrands/iphone.webp' },
            { brand: 'Samsung', img: '/images/topbrands/samsung.webp' },
            { brand: 'Xiaomi', img: '/images/topbrands/xiaomi.webp' },
            { brand: 'OnePlus', img: '/images/topbrands/oneplus.webp' },
            { brand: 'Realme', img: '/images/topbrands/realme.webp' },
            { brand: 'Motorola', img: '/images/topbrands/motorola.webp' },
            { brand: 'Google', img: '/images/topbrands/google pixel.webp' },
            { brand: 'Vivo', img: '/images/topbrands/vivo.png' },
          ].map(({ brand, img }, index) => (
            <div key={brand} onClick={() => redirectToFilterPage(brand)} className="bg-white rounded-lg overflow-hidden w-32 shadow-md cursor-pointer transition-transform duration-300 hover:scale-110 hover:shadow-lg animate-fadeInUp delay-[${index * 100}ms]">
              <img src={img} alt={brand} className="w-full h-auto transition-transform duration-300 hover:scale-105" />
              <div className="p-2 text-center font-bold">{brand}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-100 to-green-100 p-10 animate-slideInRight">
        <div className="flex flex-wrap justify-center gap-8">
          {[
            {
              badge: 'SuperB Refurbished',
              color: 'from-teal-400 to-teal-500',
              features: ['Perfect working', '6 months assured warranty', 'Very minimal scratches/Dots/marks on display and back panel', 'No Discolouration on display', 'No scratches on camera', 'No gap between back panel and body'],
            },
            {
              badge: 'Very Good Refurbished',
              color: 'from-blue-500 to-blue-700',
              features: ['Perfect working', '6 months assured warranty', 'Minimal scratches/Dots/marks on display and back panel', 'Very minimal discolouration on display', 'Very minimal scratches on camera*', 'Might have slight gap between back panel and body'],
            },
            {
              badge: 'Good Refurbished',
              color: 'from-indigo-800 to-blue-800',
              features: ['Perfect working', '6 months assured warranty', 'Few scratches/Dots/marks on display and back panel', 'Few discolouration on Display', 'Few scratches on camera** does not restrict lens view', 'Might have Slight gap between back Panel and body.', 'Might have usage marks on back Panel'],
            },
          ].map(({ badge, color, features }, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg w-80 relative transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fadeInUp delay-[${index * 200}ms]">
              <div className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-br ${color} text-white font-semibold px-6 py-3 rounded-full shadow-md animate-bounceIn`}>{badge}</div>
              <ul className="mt-8 list-none">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start mb-3 text-gray-700 animate-fadeInUp delay-[${i * 100 + 300}ms]"><span className="text-green-500 mr-2 text-xl">•</span>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;