// ProductImage.jsx (Generic, reused across all product types)
import React from 'react';
import PropTypes from 'prop-types';

const ProductImage = ({ image, brand, title }) => {
  return (
    <div className="product-image">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-[4/3] rounded-xl shadow-xl"> {/* ✅ Added container with aspect-[4/3] for consistent ratio; adjust as needed (e.g., aspect-video for 16:9) */}
        <img
          src={image}
          alt={`${brand} ${title}`}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 ease-in-out" />
      </div>
    </div>
  );
};

ProductImage.propTypes = {
  image: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ProductImage;