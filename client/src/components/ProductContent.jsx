// ProductContent.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ProductContent = ({ charger }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-12 animate-slide-up">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Product Description</h2>
      <p className="text-gray-700 leading-relaxed text-lg mb-8">
        Power up your devices efficiently with the {charger.brand} {charger.title}. This{' '}
        <span className="font-semibold text-blue-600">{charger.condition}</span> condition charger features{' '}
        <span className="font-semibold text-yellow-600">{charger.wattage}W</span> power output,{' '}
        <span className="font-semibold text-green-600">{charger.type}</span> compatibility, and{' '}
        <span className="font-semibold text-purple-600">{charger.outputCurrent}A</span> current for fast and reliable
        charging.
      </p>

      {/* Highlight Features */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center justify-center">
          <i className="fas fa-star text-yellow-500 mr-2"></i>
          Highlight Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            <i className="fas fa-bolt text-4xl text-yellow-500 mb-4"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800">High Wattage</h4>
            <p className="text-gray-600">{charger.wattage}W for fast and efficient charging</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            <i className="fas fa-plug text-4xl text-blue-500 mb-4"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800">Universal Compatibility</h4>
            <p className="text-gray-600">Supports {charger.type} devices</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            <i className="fas fa-battery-full text-4xl text-green-500 mb-4"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800">Optimal Output Current</h4>
            <p className="text-gray-600">{charger.outputCurrent} for safe and fast charging</p>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductContent.propTypes = {
  charger: PropTypes.shape({
    brand: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    condition: PropTypes.string.isRequired,
    wattage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    outputCurrent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

export default ProductContent;