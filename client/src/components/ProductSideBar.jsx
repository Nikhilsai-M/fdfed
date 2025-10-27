// ProductSidebar.jsx (Conditional based on type: charger, mouse, smartwatch, earphone)
import React from 'react';
import PropTypes from 'prop-types';

const ProductSidebar = ({ product, type }) => {
  const calculateDiscountedPrice = (originalPrice, discount) => {
    return parseFloat(originalPrice) - (parseFloat(originalPrice) * parseFloat(discount) / 100);
  };

  const getTitle = () => {
    if (type === 'mouse') return `${product.brand} ${product.title}`;
    return `${product.brand} ${product.title}`; // Default for others
  };

  const getSpecs = () => {
    const baseClasses = "flex items-center p-2 rounded-lg";
    if (type === 'charger') {
      return (
        <ul className="space-y-3 text-gray-700">
          <li className={`${baseClasses} bg-blue-50`}>
            <i className="fas fa-bolt text-yellow-500 mr-3 text-lg"></i>
            <strong className="font-medium">Wattage:</strong> {product.wattage}W
          </li>
          <li className={`${baseClasses} bg-green-50`}>
            <i className="fas fa-plug text-blue-500 mr-3 text-lg"></i>
            <strong className="font-medium">Type:</strong> {product.type}
          </li>
          <li className={`${baseClasses} bg-purple-50`}>
            <i className="fas fa-battery-full text-green-500 mr-3 text-lg"></i>
            <strong className="font-medium">Output Current:</strong> {product.outputCurrent}
          </li>
        </ul>
      );
    } else if (type === 'mouse') {
      return (
        <ul className="space-y-3 text-gray-700">
          <li className={`${baseClasses} bg-blue-50`}>
            <i className="fas fa-wifi text-yellow-500 mr-3 text-lg"></i>
            <strong className="font-medium">Connectivity:</strong> {product.connectivity}
          </li>
          <li className={`${baseClasses} bg-green-50`}>
            <i className="fas fa-crosshairs text-blue-500 mr-3 text-lg"></i>
            <strong className="font-medium">Resolution:</strong> {product.resolution} DPI
          </li>
          <li className={`${baseClasses} bg-purple-50`}>
            <i className="fas fa-mouse text-green-500 mr-3 text-lg"></i>
            <strong className="font-medium">Type:</strong> {product.type}
          </li>
        </ul>
      );
    } else if (type === 'smartwatch') {
      return (
        <ul className="space-y-3 text-gray-700">
          <li className={`${baseClasses} bg-blue-50`}>
            <i className="fas fa-expand text-yellow-500 mr-3 text-lg"></i>
            <strong className="font-medium">Display Size:</strong> {product.displaySize} inches
          </li>
          <li className={`${baseClasses} bg-green-50`}>
            <i className="fas fa-tv text-blue-500 mr-3 text-lg"></i>
            <strong className="font-medium">Display Type:</strong> {product.displayType}
          </li>
          <li className={`${baseClasses} bg-purple-50`}>
            <i className="fas fa-battery-full text-green-500 mr-3 text-lg"></i>
            <strong className="font-medium">Battery Runtime:</strong> {product.batteryRuntime} days
          </li>
        </ul>
      );
    } else if (type === 'earphone') {
      return (
        <ul className="space-y-3 text-gray-700">
          <li className={`${baseClasses} bg-blue-50`}>
            <i className="fas fa-headphones text-yellow-500 mr-3 text-lg"></i>
            <strong className="font-medium">Design:</strong> {product.design}
          </li>
          <li className={`${baseClasses} bg-green-50`}>
            <i className="fas fa-battery-full text-blue-500 mr-3 text-lg"></i>
            <strong className="font-medium">Battery Life:</strong> {product.batteryLife} hours
          </li>
          <li className={`${baseClasses} bg-purple-50`}>
            <i className="fas fa-volume-up text-green-500 mr-3 text-lg"></i>
            <strong className="font-medium">Sound Quality:</strong> Bass
          </li>
        </ul>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
        {getTitle()}
      </h1>

      {/* Price */}
      <div className="flex items-center space-x-4">
        <span className="text-3xl font-bold text-green-600 drop-shadow-sm">
          ₹{calculateDiscountedPrice(product.pricing.originalPrice, product.pricing.discount).toLocaleString('en-IN')}
        </span>
        <span className="text-xl text-gray-500 line-through">
          ₹{parseFloat(product.pricing.originalPrice).toLocaleString('en-IN')}
        </span>
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
          {product.pricing.discount} Off
        </span>
      </div>

      {/* Specifications */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <i className="fas fa-cog text-blue-500 mr-2"></i>
          Key Specifications
        </h3>
        {getSpecs()}
      </div>
    </div>
  );
};

ProductSidebar.propTypes = {
  product: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['charger', 'mouse', 'smartwatch', 'earphone']).isRequired,
};

export default ProductSidebar;