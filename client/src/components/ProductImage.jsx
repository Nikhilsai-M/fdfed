// src/components/ProductImage.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ProductImage = ({ image, alt, condition }) => {
  return (
    <div className="product-image relative">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-[4/3] rounded-xl shadow-xl">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 ease-in-out"
        />
        {condition && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {condition} Condition
          </div>
        )}
      </div>
    </div>
  );
};

ProductImage.propTypes = {
  image: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  condition: PropTypes.string,
};

export default ProductImage;