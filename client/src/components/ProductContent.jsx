
import React from 'react';
import PropTypes from 'prop-types';

const ProductContent = ({ product, type }) => {
  const getDescription = () => {
    if (type === 'charger') {
      return (
        <p className="text-gray-700 leading-relaxed text-lg mb-8">
          Power up your devices efficiently with the {product.brand} {product.title}. This{' '}
          <span className="font-semibold text-blue-600">{product.condition}</span> condition charger features{' '}
          <span className="font-semibold text-yellow-600">{product.wattage}W</span> power output,{' '}
          <span className="font-semibold text-green-600">{product.type}</span> compatibility, and{' '}
          <span className="font-semibold text-purple-600">{product.outputCurrent}</span> current for fast and reliable
          charging.
        </p>
      );
    } else if (type === 'mouse') {
      return (
        <p className="text-gray-700 leading-relaxed text-lg mb-8">
          Enhance your productivity and gaming experience with the {product.brand} {product.title}. This{' '}
          <span className="font-semibold text-blue-600">{product.condition}</span> condition mouse features{' '}
          <span className="font-semibold text-yellow-600">{product.connectivity}</span> connectivity,{' '}
          <span className="font-semibold text-green-600">{product.resolution} DPI</span> resolution, and a{' '}
          <span className="font-semibold text-purple-600">{product.type}</span> design for optimal performance.
        </p>
      );
    } else if (type === 'smartwatch') {
      return (
        <p className="text-gray-700 leading-relaxed text-lg mb-8">
          Stay connected and track your fitness with the {product.title}. This{' '}
          <span className="font-semibold text-blue-600">{product.condition}</span> condition smartwatch features a{' '}
          <span className="font-semibold text-yellow-600">{product.displaySize}</span> inch{' '}
          <span className="font-semibold text-green-600">{product.displayType}</span> display and a long-lasting battery life of{' '}
          <span className="font-semibold text-purple-600">{product.batteryRuntime}</span> days.
        </p>
      );
    } else if (type === 'earphone') {
      return (
        <p className="text-gray-700 leading-relaxed text-lg mb-8">
          Experience superior audio quality with the {product.brand} {product.title}. This{' '}
          <span className="font-semibold text-blue-600">{product.condition}</span> condition{' '}
          <span className="font-semibold text-yellow-600">{product.design}</span> earphone delivers exceptional sound with{' '}
          <span className="font-semibold text-green-600">{product.batteryLife}</span> hours of battery life.
        </p>
      );
    }
    return null;
  };

  const getFeatures = () => {
    const baseFeatureClass = "text-center p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300";
    if (type === 'charger') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${baseFeatureClass} bg-gradient-to-br from-blue-50 to-blue-100`}>
            <i className="fas fa-bolt text-4xl text-yellow-500 mb-4"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800">High Wattage</h4>
            <p className="text-gray-600">{product.wattage}W for fast and efficient charging</p>
          </div>
          <div className={`${baseFeatureClass} bg-gradient-to-br from-green-50 to-green-100`}>
            <i className="fas fa-plug text-4xl text-blue-500 mb-4"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800">Universal Compatibility</h4>
            <p className="text-gray-600">Supports {product.type} devices</p>
          </div>
          <div className={`${baseFeatureClass} bg-gradient-to-br from-purple-50 to-purple-100`}>
            <i className="fas fa-battery-full text-4xl text-green-500 mb-4"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800">Optimal Output Current</h4>
            <p className="text-gray-600">{product.outputCurrent} for safe and fast charging</p>
          </div>
        </div>
      );
    } else if (type === 'mouse') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${baseFeatureClass} bg-gradient-to-br from-blue-50 to-blue-100`}>
            <i className="fas fa-wifi text-4xl text-yellow-500 mb-4"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800">Seamless Connectivity</h4>
            <p className="text-gray-600">{product.connectivity} for reliable and fast connection</p>
          </div>
          <div className={`${baseFeatureClass} bg-gradient-to-br from-green-50 to-green-100`}>
            <i className="fas fa-crosshairs text-4xl text-blue-500 mb-4"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800">High Resolution</h4>
            <p className="text-gray-600">{product.resolution} DPI for precise tracking</p>
          </div>
          <div className={`${baseFeatureClass} bg-gradient-to-br from-purple-50 to-purple-100`}>
            <i className="fas fa-mouse text-4xl text-green-500 mb-4"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800">Ergonomic Design</h4>
            <p className="text-gray-600">{product.type} for comfortable and efficient use</p>
          </div>
        </div>
      );
    } else if (type === 'smartwatch') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${baseFeatureClass} bg-gradient-to-br from-blue-50 to-blue-100`}>
            <i className="fas fa-expand text-4xl text-yellow-500 mb-4"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800">Large Display</h4>
            <p className="text-gray-600">{product.displaySize} inch display for clear visuals</p>
          </div>
          <div className={`${baseFeatureClass} bg-gradient-to-br from-green-50 to-green-100`}>
            <i className="fas fa-tv text-4xl text-blue-500 mb-4"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800">Advanced Display</h4>
            <p className="text-gray-600">{product.displayType} for vibrant colors</p>
          </div>
          <div className={`${baseFeatureClass} bg-gradient-to-br from-purple-50 to-purple-100`}>
            <i className="fas fa-battery-full text-4xl text-green-500 mb-4"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800">Long Battery Life</h4>
            <p className="text-gray-600">Up to {product.batteryRuntime} days of usage</p>
          </div>
        </div>
      );
    } else if (type === 'earphone') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${baseFeatureClass} bg-gradient-to-br from-blue-50 to-blue-100`}>
            <i className="fas fa-headphones text-4xl text-yellow-500 mb-4"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800">Ergonomic Design</h4>
            <p className="text-gray-600">{product.design} for comfortable all-day wear</p>
          </div>
          <div className={`${baseFeatureClass} bg-gradient-to-br from-green-50 to-green-100`}>
            <i className="fas fa-battery-full text-4xl text-blue-500 mb-4"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800">Long-lasting Battery</h4>
            <p className="text-gray-600">Up to {product.batteryLife} hours of playback time</p>
          </div>
          <div className={`${baseFeatureClass} bg-gradient-to-br from-purple-50 to-purple-100`}>
            <i className="fas fa-volume-up text-4xl text-green-500 mb-4"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800">Premium Sound Quality</h4>
            <p className="text-gray-600">Bass, Clear & Balanced Sound</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-12 animate-slide-up">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Product Description</h2>
      {getDescription()}

      {/* Highlight Features */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center justify-center">
          <i className="fas fa-star text-yellow-500 mr-2"></i>
          Highlight Features
        </h3>
        {getFeatures()}
      </div>
    </div>
  );
};

ProductContent.propTypes = {
  product: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['charger', 'mouse', 'smartwatch', 'earphone']).isRequired,
};

export default ProductContent;