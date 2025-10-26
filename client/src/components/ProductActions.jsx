// ProductActions.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ProductActions = ({ onAddToCart, onBuyNow, chargerId }) => {
  return (
    <div className="product-actions flex flex-col sm:flex-row gap-4">
      <button
        onClick={onAddToCart}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
      >
        <i className="fas fa-shopping-cart text-lg"></i>
        <span>Add to Cart</span>
      </button>
      <button
        onClick={onBuyNow}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
      >
        <i className="fas fa-bolt text-lg"></i>
        <span>Buy Now</span>
      </button>
    </div>
  );
};

ProductActions.propTypes = {
  onAddToCart: PropTypes.func.isRequired,
  onBuyNow: PropTypes.func.isRequired,
  chargerId: PropTypes.string.isRequired,
};

export default ProductActions;