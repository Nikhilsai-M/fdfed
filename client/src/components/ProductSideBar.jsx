import React from 'react';
import PropTypes from 'prop-types';

const ProductSidebar = ({ product, type }) => {
  const calculateDiscountedPrice = (originalPrice, discount) => {
    return parseFloat(originalPrice) - (parseFloat(originalPrice) * parseFloat(discount) / 100);
  };

  const getTitle = () => {
    if (type === 'phone') {
      return `${product.brand} ${product.model}`;
    } else if (type === 'laptop') {
      return `${product.brand} ${product.series || product.model}`;
    } else {
      return `${product.brand} ${product.title}`;
    }
  };

  const getColorBadge = () => {
    if ((type === 'phone' || type === 'laptop') && product.color) {
      return (
        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {product.color}
        </span>
      );
    }
    return null;
  };

  const getPriceData = () => {
    if (type === 'phone' || type === 'laptop') {
      return {
        originalPrice: product.pricing?.basePrice || product.base_price,
        discount: product.pricing?.discount || product.discount
      };
    } else {
      return {
        originalPrice: product.pricing?.originalPrice,
        discount: product.pricing?.discount
      };
    }
  };

  const getPhoneSpecs = () => (
    <ul className="space-y-3 text-gray-700">
      <li className="flex items-center p-2 rounded-lg bg-blue-50">
        <i className="fas fa-microchip text-yellow-500 mr-3 text-lg"></i>
        <strong className="font-medium">Processor:</strong> {product.specs?.processor || product.processor}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-green-50">
        <i className="fas fa-display text-blue-500 mr-3 text-lg"></i>
        <strong className="font-medium">Display:</strong> {product.specs?.display || product.display}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-purple-50">
        <i className="fas fa-battery-full text-green-500 mr-3 text-lg"></i>
        <strong className="font-medium">Battery:</strong> {product.specs?.battery || product.battery}mAh
      </li>
      <li className="flex items-center p-2 rounded-lg bg-yellow-50">
        <i className="fas fa-camera text-red-500 mr-3 text-lg"></i>
        <strong className="font-medium">Camera:</strong> {product.specs?.camera || product.camera}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-red-50">
        <i className="fab fa-android text-green-500 mr-3 text-lg"></i>
        <strong className="font-medium">OS:</strong> {product.specs?.os || product.os}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-indigo-50">
        <i className="fas fa-network-wired text-purple-500 mr-3 text-lg"></i>
        <strong className="font-medium">Network:</strong> {product.specs?.network || product.network}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-pink-50">
        <i className="fas fa-weight-hanging text-gray-500 mr-3 text-lg"></i>
        <strong className="font-medium">Weight:</strong> {product.specs?.weight || product.weight}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-teal-50">
        <i className="fas fa-memory text-blue-500 mr-3 text-lg"></i>
        <strong className="font-medium">RAM:</strong> {product.ram}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-orange-50">
        <i className="fas fa-hdd text-orange-500 mr-3 text-lg"></i>
        <strong className="font-medium">Storage:</strong> {product.rom || product.storage}
      </li>
    </ul>
  );

  const getLaptopSpecs = () => (
    <ul className="space-y-3 text-gray-700">
      <li className="flex items-center p-2 rounded-lg bg-blue-50">
        <i className="fas fa-microchip text-yellow-500 mr-3 text-lg"></i>
        <strong className="font-medium">Processor:</strong> {product.processor?.name || product.processor_name} {product.processor?.generation || product.processor_generation}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-purple-50">
        <i className="fas fa-memory text-green-500 mr-3 text-lg"></i>
        <strong className="font-medium">RAM:</strong> {product.memory?.ram || product.ram}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-yellow-50">
        <i className="fas fa-hdd text-orange-500 mr-3 text-lg"></i>
        <strong className="font-medium">Storage:</strong> {product.memory?.storage?.type || product.storage_type} {product.memory?.storage?.capacity || product.storage_capacity}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-red-50">
        <i className="fab fa-windows text-blue-500 mr-3 text-lg"></i>
        <strong className="font-medium">OS:</strong> {product.os}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-indigo-50">
        <i className="fas fa-weight text-gray-500 mr-3 text-lg"></i>
        <strong className="font-medium">Weight:</strong> {product.specs?.weight || `${product.weight} kg`}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-pink-50">
        <i className="fas fa-expand text-purple-500 mr-3 text-lg"></i>
        <strong className="font-medium">Display Size:</strong> {product.displaysize || product.display_size}"
      </li>
    </ul>
  );

  const getChargerSpecs = () => (
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

  const getMouseSpecs = () => (
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

  const getSmartwatchSpecs = () => (
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

  const getEarphoneSpecs = () => (
    <ul className="space-y-3 text-gray-700">
      <li className="flex items-center p-2 rounded-lg bg-blue-50">
        <i className="fas fa-headphones text-yellow-500 mr-3 text-lg"></i>
        <strong className="font-medium">Design:</strong> {product.design}
      </li>
      <li className="flex items-center p-2 rounded-lg bg-green-50">
        <i className="fas fa-battery-full text-blue-500 mr-3 text-lg"></i>
        <strong className="font-medium">Battery Life:</strong> {product.batteryLife} hours
      </li>
      <li className="flex items-center p-2 rounded-lg bg-purple-50">
        <i className="fas fa-volume-up text-green-500 mr-3 text-lg"></i>
        <strong className="font-medium">Sound Quality:</strong> Bass
      </li>
    </ul>
  );

  const getSpecifications = () => {
    switch (type) {
      case 'phone':
        return getPhoneSpecs();
      case 'laptop':
        return getLaptopSpecs();
      case 'charger':
        return getChargerSpecs();
      case 'mouse':
        return getMouseSpecs();
      case 'smartwatch':
        return getSmartwatchSpecs();
      case 'earphone':
        return getEarphoneSpecs();
      default:
        return null;
    }
  };

  const priceData = getPriceData();
  const discountedPrice = calculateDiscountedPrice(priceData.originalPrice, priceData.discount);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
        {getTitle()}
      </h1>

      <div className="flex items-center space-x-2">
        {getColorBadge()}
        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
          {product.condition} Condition
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-4">
        <span className="text-3xl font-bold text-green-600 drop-shadow-sm">
          ₹{discountedPrice.toLocaleString('en-IN')}
        </span>
        <span className="text-xl text-gray-500 line-through">
          ₹{parseFloat(priceData.originalPrice).toLocaleString('en-IN')}
        </span>
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
          {priceData.discount}% Off
        </span>
      </div>

      {/* Additional Info for Phones */}
      {type === 'phone' && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <i className="fas fa-shield-alt text-green-500 mr-2"></i>
                6 Months Warranty
              </span>
              <span className="flex items-center">
                <i className="fas fa-shipping-fast text-blue-500 mr-2"></i>
                Free Shipping
              </span>
              <span className="flex items-center">
                <i className="fas fa-check-circle text-purple-500 mr-2"></i>
                Quality Certified
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Additional Info for Laptops */}
      {type === 'laptop' && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <i className="fas fa-shield-alt text-green-500 mr-2"></i>
                12 Months Warranty
              </span>
              <span className="flex items-center">
                <i className="fas fa-shipping-fast text-blue-500 mr-2"></i>
                Free Shipping
              </span>
              <span className="flex items-center">
                <i className="fas fa-check-circle text-purple-500 mr-2"></i>
                Quality Certified
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Additional Info for Accessories */}
      {(type === 'charger' || type === 'mouse' || type === 'smartwatch' || type === 'earphone') && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <i className="fas fa-shield-alt text-green-500 mr-2"></i>
                3 Months Warranty
              </span>
              <span className="flex items-center">
                <i className="fas fa-shipping-fast text-blue-500 mr-2"></i>
                Free Shipping
              </span>
              <span className="flex items-center">
                <i className="fas fa-check-circle text-purple-500 mr-2"></i>
                Tested & Verified
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Specifications */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <i className="fas fa-cog text-blue-500 mr-2"></i>
          Key Specifications
        </h3>
        {getSpecifications()}
      </div>

      {/* Quick Features */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
        <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
          <i className="fas fa-bolt text-yellow-500 mr-2"></i>
          Quick Features
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
          {type === 'phone' && (
            <>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                {product.ram} RAM + {product.rom} Storage
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                {product.specs?.battery || product.battery}mAh Battery
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                {product.specs?.camera || product.camera} Camera
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                {product.specs?.display || product.display} Display
              </span>
            </>
          )}
          
          {type === 'laptop' && (
            <>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                {product.memory?.ram || product.ram} RAM + {product.memory?.storage?.capacity || product.storage_capacity} {product.memory?.storage?.type || product.storage_type}
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                {product.processor?.name || product.processor_name} {product.processor?.generation || product.processor_generation}
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                {product.specs?.display || `${product.display_size}" Display`}
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                {product.os} Operating System
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                Portable {product.specs?.weight || `${product.weight} kg`} Design
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                12 Months Comprehensive Warranty
              </span>
            </>
          )}
          
          {type === 'charger' && (
            <>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                Fast Charging Technology
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                Overheat Protection
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                Universal Compatibility
              </span>
            </>
          )}
          {type === 'mouse' && (
            <>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                Precision Tracking
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                Ergonomic Design
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                Plug & Play Setup
              </span>
            </>
          )}
          {type === 'smartwatch' && (
            <>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                Health Monitoring
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                Smart Notifications
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                Water Resistant
              </span>
            </>
          )}
          {type === 'earphone' && (
            <>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                Noise Cancellation
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                Wireless Freedom
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                Quick Charge
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

ProductSidebar.propTypes = {
  product: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['phone', 'laptop', 'charger', 'mouse', 'smartwatch', 'earphone']).isRequired,
};

export default ProductSidebar;