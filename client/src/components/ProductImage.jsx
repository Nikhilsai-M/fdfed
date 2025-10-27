// ProductImage.jsx (Generic, reused across all product types)
import React from 'react';
import PropTypes from 'prop-types';

const ProductImage = ({ image, brand, title }) => {
  return (
    <div className="product-image">
      <img
        src={image}
        alt={`${brand} ${title}`}
        className="w-full h-96 object-cover rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out"
      />
    </div>
  );
};

ProductImage.propTypes = {
  image: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ProductImage;