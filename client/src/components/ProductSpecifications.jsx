// src/components/ProductSpecifications.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ProductSpecifications = ({ product, type }) => {
  const getPhoneSpecs = () => (
    <ul className="space-y-3 text-gray-700">
      <li className="flex items-center p-2 rounded-lg bg-blue-50">
        <i className="fas fa-microchip text-yellow-500 mr-3 text-lg"></i>
        <strong className="font-medium">Processor:</strong> {product.specs?.processor}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-green-50">
        <i className="fas fa-display text-blue-500 mr-3 text-lg"></i>
        <strong className="font-medium">Display:</strong> {product.specs?.display}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-purple-50">
        <i className="fas fa-battery-full text-green-500 mr-3 text-lg"></i>
        <strong className="font-medium">Battery:</strong> {product.specs?.battery}mAh
      </li>
      <li className="flex items-center p-2 rounded-lg bg-yellow-50">
        <i className="fas fa-camera text-red-500 mr-3 text-lg"></i>
        <strong className="font-medium">Camera:</strong> {product.specs?.camera}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-red-50">
        <i className="fab fa-android text-green-500 mr-3 text-lg"></i>
        <strong className="font-medium">OS:</strong> {product.specs?.os}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-indigo-50">
        <i className="fas fa-network-wired text-purple-500 mr-3 text-lg"></i>
        <strong className="font-medium">Network:</strong> {product.specs?.network}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-pink-50">
        <i className="fas fa-weight-hanging text-gray-500 mr-3 text-lg"></i>
        <strong className="font-medium">Weight:</strong> {product.specs?.weight}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-teal-50">
        <i className="fas fa-memory text-blue-500 mr-3 text-lg"></i>
        <strong className="font-medium">RAM:</strong> {product.ram}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-orange-50">
        <i className="fas fa-hdd text-orange-500 mr-3 text-lg"></i>
        <strong className="font-medium">Storage:</strong> {product.rom}
      </li>
    </ul>
  );

  const getAccessorySpecs = () => {
    if (type === 'charger') {
      return (
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center p-2 rounded-lg bg-blue-50">
            <i className="fas fa-bolt text-yellow-500 mr-3 text-lg"></i>
            <strong className="font-medium">Wattage:</strong> {product.wattage}W
          </li>
          <li className="flex items-center p-2 rounded-lg bg-green-50">
            <i className="fas fa-plug text-blue-500 mr-3 text-lg"></i>
            <strong className="font-medium">Type:</strong> {product.type}
          </li>
          <li className="flex items-center p-2 rounded-lg bg-purple-50">
            <i className="fas fa-battery-full text-green-500 mr-3 text-lg"></i>
            <strong className="font-medium">Output Current:</strong> {product.outputCurrent}
          </li>
        </ul>
      );
    } else if (type === 'mouse') {
      return (
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center p-2 rounded-lg bg-blue-50">
            <i className="fas fa-wifi text-yellow-500 mr-3 text-lg"></i>
            <strong className="font-medium">Connectivity:</strong> {product.connectivity}
          </li>
          <li className="flex items-center p-2 rounded-lg bg-green-50">
            <i className="fas fa-crosshairs text-blue-500 mr-3 text-lg"></i>
            <strong className="font-medium">Resolution:</strong> {product.resolution} DPI
          </li>
          <li className="flex items-center p-2 rounded-lg bg-purple-50">
            <i className="fas fa-mouse text-green-500 mr-3 text-lg"></i>
            <strong className="font-medium">Type:</strong> {product.type}
          </li>
        </ul>
      );
    } else if (type === 'smartwatch') {
      return (
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center p-2 rounded-lg bg-blue-50">
            <i className="fas fa-expand text-yellow-500 mr-3 text-lg"></i>
            <strong className="font-medium">Display Size:</strong> {product.displaySize} inches
          </li>
          <li className="flex items-center p-2 rounded-lg bg-green-50">
            <i className="fas fa-tv text-blue-500 mr-3 text-lg"></i>
            <strong className="font-medium">Display Type:</strong> {product.displayType}
          </li>
          <li className="flex items-center p-2 rounded-lg bg-purple-50">
            <i className="fas fa-battery-full text-green-500 mr-3 text-lg"></i>
            <strong className="font-medium">Battery Runtime:</strong> {product.batteryRuntime} days
          </li>
        </ul>
      );
    } else if (type === 'earphone') {
      return (
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center p-2 rounded-lg bg-blue-50">
            <i className="fas fa-headphones text-yellow-500 mr-3 text-lg"></i>
            <strong className="font-medium">Design:</strong> {product.design}
          </li>
          <li className="flex items-center p-2 rounded-lg bg-green-50">
            <i className="fas fa-battery-full text-blue-500 mr-3 text-lg"></i>
            <strong className="font-medium">Battery Life:</strong> {product.batteryLife} hours
          </li>
        </ul>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
        <i className="fas fa-cog text-blue-500 mr-2"></i>
        Key Specifications
      </h3>
      {type === 'phone' ? getPhoneSpecs() : getAccessorySpecs()}
    </div>
  );
};

ProductSpecifications.propTypes = {
  product: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['phone', 'charger', 'mouse', 'smartwatch', 'earphone']).isRequired,
};

export default ProductSpecifications;