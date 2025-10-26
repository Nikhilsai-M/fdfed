// ProductSidebar.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ProductSidebar = ({ charger }) => {
  const calculateDiscountedPrice = (originalPrice, discount) => {
    return parseFloat(originalPrice) - (parseFloat(originalPrice) * parseFloat(discount) / 100);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
        {charger.title}
      </h1>

      {/* Price */}
      <div className="flex items-center space-x-4">
        <span className="text-3xl font-bold text-green-600 drop-shadow-sm">
          ₹{calculateDiscountedPrice(charger.pricing.originalPrice, charger.pricing.discount).toLocaleString('en-IN')}
        </span>
        <span className="text-xl text-gray-500 line-through">
          ₹{parseFloat(charger.pricing.originalPrice).toLocaleString('en-IN')}
        </span>
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
          {charger.pricing.discount} Off
        </span>
      </div>

      {/* Specifications */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <i className="fas fa-cog text-blue-500 mr-2"></i>
          Key Specifications
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center p-2 bg-blue-50 rounded-lg">
            <i className="fas fa-bolt text-yellow-500 mr-3 text-lg"></i>
            <strong className="font-medium">Wattage:</strong> {charger.wattage}W
          </li>
          <li className="flex items-center p-2 bg-green-50 rounded-lg">
            <i className="fas fa-plug text-blue-500 mr-3 text-lg"></i>
            <strong className="font-medium">Type:</strong> {charger.type}
          </li>
          <li className="flex items-center p-2 bg-purple-50 rounded-lg">
            <i className="fas fa-battery-full text-green-500 mr-3 text-lg"></i>
            <strong className="font-medium">Output Current:</strong> {charger.outputCurrent}
          </li>
        </ul>
      </div>
    </div>
  );
};

ProductSidebar.propTypes = {
  charger: PropTypes.shape({
    title: PropTypes.string.isRequired,
    pricing: PropTypes.shape({
      originalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      discount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
    wattage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    outputCurrent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

export default ProductSidebar;