// ProductImage.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ProductImage = ({ charger }) => {
  return (
    <div className="product-image">
      <img
        src={charger.image}
        alt={`${charger.brand} ${charger.title}`}
        className="w-full h-96 object-cover rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out"
      />
    </div>
  );
};

ProductImage.propTypes = {
  charger: PropTypes.shape({
    image: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductImage;