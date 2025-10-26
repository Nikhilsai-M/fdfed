// CartMessage.jsx
import React from 'react';
import PropTypes from 'prop-types';

const CartMessage = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-green-500 text-white p-6 rounded-xl shadow-2xl border-l-4 border-green-700 animate-slide-in-right fade-in">
      <p className="font-semibold flex items-center justify-between">
        {message}
        <a
          href="/cart"
          className="ml-4 underline hover:no-underline transition-colors duration-200"
        >
          View Cart →
        </a>
      </p>
    </div>
  );
};

CartMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CartMessage;