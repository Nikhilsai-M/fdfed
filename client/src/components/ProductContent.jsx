// src/components/ProductContent.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ProductContent = ({ product, type }) => {
  const getPhoneDescription = () => (
    <div className="space-y-6">
      <p className="text-gray-700 leading-relaxed text-lg">
        Experience exceptional performance with the {product.brand} {product.model}. This{' '}
        <span className="font-semibold text-blue-600">{product.condition}</span> condition smartphone is engineered to deliver 
        outstanding performance for your daily needs and beyond.
      </p>
      
      <p className="text-gray-700 leading-relaxed text-lg">
        Powered by a <span className="font-semibold text-yellow-600">{product.specs?.processor}</span> processor and 
        equipped with <span className="font-semibold text-green-600">{product.ram} RAM</span> and{' '}
        <span className="font-semibold text-purple-600">{product.rom} storage</span>, this device handles multitasking 
        and storage with ease. The {product.specs?.display} display brings your content to life with vibrant colors 
        and sharp details.
      </p>

      <p className="text-gray-700 leading-relaxed text-lg">
        Capture stunning photos and videos with the {product.specs?.camera} camera system, while the massive{' '}
        <span className="font-semibold text-red-600">{product.specs?.battery}mAh battery</span> ensures you stay 
        connected throughout the day. Running on {product.specs?.os} with {product.specs?.network} connectivity, 
        this phone is your perfect companion for work and entertainment.
      </p>
    </div>
  );

const getLaptopDescription = () => (
  <div className="space-y-6">
    <p className="text-gray-700 leading-relaxed text-lg">
      Experience exceptional performance with the {product.brand} {product.series}. This{' '}
      <span className="font-semibold text-blue-600">{product.condition}</span> condition laptop is engineered to deliver 
      outstanding performance for your work, creativity, and entertainment needs.
    </p>
    
    <p className="text-gray-700 leading-relaxed text-lg">
      Powered by a <span className="font-semibold text-yellow-600">{product.processor?.name || product.processor_name} {product.processor?.generation || product.processor_generation}</span> processor and 
      equipped with <span className="font-semibold text-green-600">{product.memory?.ram || product.ram} RAM</span> and{' '}
      <span className="font-semibold text-purple-600">{product.memory?.storage?.type || product.storage_type} {product.memory?.storage?.capacity || product.storage_capacity} storage</span>, 
      this device handles multitasking and demanding applications with ease. The {product.specs?.display || `${product.display_size}" Display`} brings 
      your content to life with vibrant colors and sharp details.
    </p>

    <p className="text-gray-700 leading-relaxed text-lg">
      Running on <span className="font-semibold text-red-600">{product.os}</span> and weighing only{' '}
      <span className="font-semibold text-orange-600">{product.specs?.weight || `${product.weight} kg`}</span>, this laptop combines power with 
      portability. Perfect for professionals, students, and creatives who need reliable performance on the go.
    </p>
  </div>
);

  const getChargerDescription = () => (
    <div className="space-y-6">
      <p className="text-gray-700 leading-relaxed text-lg">
        Power up your devices efficiently with the {product.brand} {product.title}. This{' '}
        <span className="font-semibold text-blue-600">{product.condition}</span> condition charger delivers reliable 
        and fast charging for all your compatible devices.
      </p>
      
      <p className="text-gray-700 leading-relaxed text-lg">
        Featuring <span className="font-semibold text-yellow-600">{product.wattage}W</span> power output and{' '}
        <span className="font-semibold text-green-600">{product.type}</span> compatibility, this charger ensures 
        your devices are powered up quickly and safely. The <span className="font-semibold text-purple-600">
        {product.outputCurrent}</span> output current provides optimal charging efficiency while protecting 
        your device's battery health.
      </p>

      <p className="text-gray-700 leading-relaxed text-lg">
        Built with advanced safety features including over-current protection, over-voltage protection, 
        and short-circuit protection, this charger guarantees safe charging for your valuable devices. 
        Its compact and portable design makes it perfect for both home and travel use.
      </p>
    </div>
  );

  const getMouseDescription = () => (
    <div className="space-y-6">
      <p className="text-gray-700 leading-relaxed text-lg">
        Enhance your productivity and gaming experience with the {product.brand} {product.title}. This{' '}
        <span className="font-semibold text-blue-600">{product.condition}</span> condition mouse is designed 
        for precision and comfort.
      </p>
      
      <p className="text-gray-700 leading-relaxed text-lg">
        With <span className="font-semibold text-yellow-600">{product.connectivity}</span> connectivity and{' '}
        <span className="font-semibold text-green-600">{product.resolution} DPI</span> resolution, enjoy 
        seamless wireless performance and precise tracking for both work and gaming. The{' '}
        <span className="font-semibold text-purple-600">{product.type}</span> design ensures comfortable 
        usage during long sessions.
      </p>

      <p className="text-gray-700 leading-relaxed text-lg">
        Engineered with high-precision optical sensor and responsive buttons, this mouse delivers accurate 
        cursor control and quick response times. The ergonomic shape reduces hand fatigue, making it ideal 
        for extended computer use.
      </p>
    </div>
  );

  const getSmartwatchDescription = () => (
    <div className="space-y-6">
      <p className="text-gray-700 leading-relaxed text-lg">
        Stay connected and track your fitness with the {product.brand} {product.title}. This{' '}
        <span className="font-semibold text-blue-600">{product.condition}</span> condition smartwatch 
        combines style with smart functionality.
      </p>
      
      <p className="text-gray-700 leading-relaxed text-lg">
        Featuring a <span className="font-semibold text-yellow-600">{product.displaySize}-inch</span>{' '}
        <span className="font-semibold text-green-600">{product.displayType}</span> display, enjoy clear 
        and vibrant visuals for all your notifications and fitness data. With up to{' '}
        <span className="font-semibold text-purple-600">{product.batteryRuntime} days</span> of battery 
        life, stay connected without frequent charging.
      </p>

      <p className="text-gray-700 leading-relaxed text-lg">
        Monitor your heart rate, track your workouts, receive smart notifications, and control your music 
        right from your wrist. With multiple sports modes and health monitoring features, this smartwatch 
        is your perfect fitness companion and lifestyle accessory.
      </p>
    </div>
  );

  const getEarphoneDescription = () => (
    <div className="space-y-6">
      <p className="text-gray-700 leading-relaxed text-lg">
        Experience superior audio quality with the {product.brand} {product.title}. These{' '}
        <span className="font-semibold text-blue-600">{product.condition}</span> condition earphones 
        deliver exceptional sound performance.
      </p>
      
      <p className="text-gray-700 leading-relaxed text-lg">
        The <span className="font-semibold text-yellow-600">{product.design}</span> design provides 
        comfortable and secure fit for all-day wear. With up to{' '}
        <span className="font-semibold text-green-600">{product.batteryLife} hours</span> of battery life, 
        enjoy uninterrupted music, calls, and entertainment.
      </p>

      <p className="text-gray-700 leading-relaxed text-lg">
        Featuring advanced audio technology with deep bass, clear mids, and crisp highs, these earphones 
        provide immersive sound quality. With noise cancellation technology, focus on your music or calls 
        without distractions from your surroundings.
      </p>
    </div>
  );

  const getPhoneFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
        <i className="fas fa-microchip text-4xl text-yellow-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Powerful Performance</h4>
        <p className="text-gray-600">{product.specs?.processor} with {product.ram} RAM for smooth multitasking</p>
      </div>
      
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
        <i className="fas fa-display text-4xl text-blue-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Immersive Display</h4>
        <p className="text-gray-600">{product.specs?.display} for stunning visuals and vibrant colors</p>
      </div>
      
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
        <i className="fas fa-battery-full text-4xl text-green-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">All-Day Battery</h4>
        <p className="text-gray-600">{product.specs?.battery}mAh battery for extended usage without charging</p>
      </div>
      
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
        <i className="fas fa-camera text-4xl text-purple-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Advanced Camera</h4>
        <p className="text-gray-600">{product.specs?.camera} for professional-quality photos and videos</p>
      </div>

      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
        <i className="fas fa-network-wired text-4xl text-indigo-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Fast Connectivity</h4>
        <p className="text-gray-600">{product.specs?.network} support for seamless internet and calls</p>
      </div>

      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
        <i className="fas fa-hdd text-4xl text-orange-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Ample Storage</h4>
        <p className="text-gray-600">{product.rom} storage for all your apps, photos, and media files</p>
      </div>
    </div>
  );

  const getLaptopFeatures = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
      <i className="fas fa-microchip text-4xl text-yellow-500 mb-4"></i>
      <h4 className="font-bold text-lg mb-2 text-gray-800">Powerful Performance</h4>
      <p className="text-gray-600">{product.processor?.name || product.processor_name} {product.processor?.generation || product.processor_generation} processor</p>
    </div>
    
    <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
      <i className="fas fa-display text-4xl text-blue-500 mb-4"></i>
      <h4 className="font-bold text-lg mb-2 text-gray-800">Immersive Display</h4>
      <p className="text-gray-600">{product.specs?.display || `${product.display_size}" Display`} for stunning visuals</p>
    </div>
    
    <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
      <i className="fas fa-memory text-4xl text-green-500 mb-4"></i>
      <h4 className="font-bold text-lg mb-2 text-gray-800">Fast Memory</h4>
      <p className="text-gray-600">{product.memory?.ram || product.ram} RAM for smooth multitasking</p>
    </div>
    
    <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
      <i className="fas fa-hdd text-4xl text-purple-500 mb-4"></i>
      <h4 className="font-bold text-lg mb-2 text-gray-800">Ample Storage</h4>
      <p className="text-gray-600">{product.memory?.storage?.type || product.storage_type} {product.memory?.storage?.capacity || product.storage_capacity}</p>
    </div>

    <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
      <i className="fab fa-windows text-4xl text-indigo-500 mb-4"></i>
      <h4 className="font-bold text-lg mb-2 text-gray-800">Modern OS</h4>
      <p className="text-gray-600">{product.os} for optimal performance</p>
    </div>

    <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
      <i className="fas fa-weight text-4xl text-orange-500 mb-4"></i>
      <h4 className="font-bold text-lg mb-2 text-gray-800">Portable Design</h4>
      <p className="text-gray-600">Lightweight at {product.specs?.weight || `${product.weight} kg`}</p>
    </div>
  </div>
);

  const getChargerFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
        <i className="fas fa-bolt text-4xl text-yellow-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Fast Charging</h4>
        <p className="text-gray-600">{product.wattage}W high-speed charging for quick power delivery</p>
      </div>
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
        <i className="fas fa-plug text-4xl text-blue-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Universal Compatibility</h4>
        <p className="text-gray-600">Works with {product.type} devices and multiple brands</p>
      </div>
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
        <i className="fas fa-shield-alt text-4xl text-green-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Safety Protection</h4>
        <p className="text-gray-600">Multiple protection systems for safe and reliable charging</p>
      </div>
    </div>
  );

  const getMouseFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
        <i className="fas fa-wifi text-4xl text-yellow-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Wireless Freedom</h4>
        <p className="text-gray-600">{product.connectivity} technology for clutter-free workspace</p>
      </div>
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
        <i className="fas fa-crosshairs text-4xl text-blue-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Precision Tracking</h4>
        <p className="text-gray-600">{product.resolution} DPI for accurate and smooth cursor control</p>
      </div>
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
        <i className="fas fa-mouse text-4xl text-green-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Ergonomic Design</h4>
        <p className="text-gray-600">{product.type} shape for comfortable long-term usage</p>
      </div>
    </div>
  );

  const getSmartwatchFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
        <i className="fas fa-expand text-4xl text-yellow-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Large Display</h4>
        <p className="text-gray-600">{product.displaySize}-inch {product.displayType} for clear visibility</p>
      </div>
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
        <i className="fas fa-heartbeat text-4xl text-blue-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Health Monitoring</h4>
        <p className="text-gray-600">Track heart rate, sleep, and multiple fitness activities</p>
      </div>
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
        <i className="fas fa-battery-full text-4xl text-green-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Long Battery Life</h4>
        <p className="text-gray-600">Up to {product.batteryRuntime} days of usage on single charge</p>
      </div>
    </div>
  );

  const getEarphoneFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
        <i className="fas fa-headphones text-4xl text-yellow-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Comfortable Design</h4>
        <p className="text-gray-600">{product.design} design for secure and comfortable all-day wear</p>
      </div>
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
        <i className="fas fa-battery-full text-4xl text-blue-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Extended Playback</h4>
        <p className="text-gray-600">Up to {product.batteryLife} hours of continuous music and calls</p>
      </div>
      <div className="text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
        <i className="fas fa-volume-up text-4xl text-green-500 mb-4"></i>
        <h4 className="font-bold text-lg mb-2 text-gray-800">Premium Sound</h4>
        <p className="text-gray-600">High-quality audio with deep bass and crystal-clear sound</p>
      </div>
    </div>
  );

  const getDescription = () => {
    switch (type) {
      case 'phone':
        return getPhoneDescription();
      case 'laptop':
        return getLaptopDescription();
      case 'charger':
        return getChargerDescription();
      case 'mouse':
        return getMouseDescription();
      case 'smartwatch':
        return getSmartwatchDescription();
      case 'earphone':
        return getEarphoneDescription();
      default:
        return null;
    }
  };

  const getFeatures = () => {
    switch (type) {
      case 'phone':
        return getPhoneFeatures();
      case 'laptop':
        return getLaptopFeatures();
      case 'charger':
        return getChargerFeatures();
      case 'mouse':
        return getMouseFeatures();
      case 'smartwatch':
        return getSmartwatchFeatures();
      case 'earphone':
        return getEarphoneFeatures();
      default:
        return null;
    }
  };

  const getInTheBox = () => {
    const baseItems = {
      phone: ['Smartphone', 'Charging Cable', 'Adapter', 'SIM Ejector Tool', 'Documentation'],
      laptop: ['Laptop', 'Charger', 'User Manual', 'Warranty Card'],
      charger: ['Charger', 'User Manual', 'Warranty Card'],
      mouse: ['Wireless Mouse', 'USB Receiver', 'Battery', 'User Manual'],
      smartwatch: ['Smartwatch', 'Charging Cable', 'User Manual', 'Warranty Card'],
      earphone: ['Earphones', 'Charging Case', 'Charging Cable', 'Earbud Tips', 'User Manual']
    };

    const items = baseItems[type] || baseItems.phone;

    return (
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <i className="fas fa-box-open text-blue-500 mr-2"></i>
          What's in the Box
        </h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center text-gray-700">
              <i className="fas fa-check text-green-500 mr-3"></i>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Product Description */}
      <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-up">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">Product Description</h2>
        {getDescription()}
      </div>

      {/* Highlight Features */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center justify-center">
          <i className="fas fa-star text-yellow-500 mr-2"></i>
          Highlight Features
        </h3>
        {getFeatures()}
      </div>

      {/* What's in the Box */}
      {getInTheBox()}

      {/* Warranty & Support */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <i className="fas fa-shield-alt text-green-500 mr-2"></i>
          Warranty & Support
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="space-y-2">
            <div className="flex items-center">
              <i className="fas fa-calendar-check text-blue-500 mr-3"></i>
              <span><strong>Warranty:</strong> {
                type === 'phone' ? '6 Months' : 
                type === 'laptop' ? '12 Months' : '3 Months'
              } Comprehensive Warranty</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-tools text-purple-500 mr-3"></i>
              <span><strong>Support:</strong> Free technical support and troubleshooting</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <i className="fas fa-shipping-fast text-green-500 mr-3"></i>
              <span><strong>Delivery:</strong> Free shipping with 2-3 business days delivery</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-undo text-orange-500 mr-3"></i>
              <span><strong>Returns:</strong> 7-day easy return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductContent.propTypes = {
  product: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['phone', 'laptop', 'charger', 'mouse', 'smartwatch', 'earphone']).isRequired,
};

export default ProductContent;