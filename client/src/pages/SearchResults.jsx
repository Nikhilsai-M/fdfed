import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContent';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(query);

  const { updateCart } = useCart();
  const navigate = useNavigate();

  const fetchSearchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch search results');

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err.message || 'Error fetching search results');
      console.error('Error fetching search results:', err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (query) {
      setSearchInput(query);
      fetchSearchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query, fetchSearchResults]);

  const addToCart = async (product) => {
    try {
      const profileRes = await fetch('/api/user/profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (!profileRes.ok) {
        navigate('/sign-in');
        return;
      }

      const userData = await profileRes.json();
      if (!userData?.success || !userData?.user) {
        navigate('/sign-in');
        return;
      }

      const userId = userData.user.user_id;
      const userCartKey = `cart_user_${userId}`;

      if (!product || !product.id) return;

      const currentCart = JSON.parse(localStorage.getItem(userCartKey)) || [];

      const cartProduct = {
        id: product.id,
        name: product.title || `${product.brand || ''} ${product.model || ''}`.trim(),
        brand: product.brand || '',
        model: product.model || '',
        ram: product.ram || '',
        rom: product.rom || '',
        image: product.image,
        price: Number(product.price ?? product.finalPrice ?? 0),
        discount: Number(product.discount || 0),
        quantity: 1,
        type: product.type,
      };

      const existingIndex = currentCart.findIndex(
        (item) => item.id === cartProduct.id && item.type === cartProduct.type
      );

      let updatedCart;
      if (existingIndex !== -1) {
        updatedCart = [...currentCart];
        updatedCart[existingIndex].quantity += 1;
      } else {
        updatedCart = [...currentCart, cartProduct];
      }

      localStorage.setItem(userCartKey, JSON.stringify(updatedCart));
      updateCart(updatedCart, userId);

      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      navigate('/sign-in');
    }
  };

  const getProductLink = (product) => {
    switch (product.type) {
      case 'phone':
        return `/product/${product.id}`;
      case 'laptop':
        return `/laptop/${product.id}`;
      case 'earphone':
        return `/earphone/${product.id}`;
      case 'charger':
        return `/charger/${product.id}`;
      case 'mouse':
        return `/mouse/${product.id}`;
      case 'smartwatch':
        return `/smartwatch/${product.id}`;
      default:
        return '#';
    }
  };

  const getProductTypeLabel = (type) => {
    const labels = {
      phone: 'Phone',
      laptop: 'Laptop',
      earphone: 'Earphone',
      charger: 'Charger',
      mouse: 'Mouse',
      smartwatch: 'Smartwatch',
    };
    return labels[type] || type;
  };

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {query ? `Search Results for "${query}"` : 'Search Products'}
            </h1>

            {results.length > 0 && query && (
              <p className="text-gray-600">
                Found {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
            )}
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}

          {!loading && !error && results.length === 0 && query && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No results found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching "{query}"
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Go to Homepage
              </button>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((product) => (
                <div
                  key={`${product.type}-${product.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <Link to={getProductLink(product)} className="block">
                    <div className="aspect-w-16 aspect-h-16 bg-gray-100 p-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-48 object-contain"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                        }}
                      />
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                          {getProductTypeLabel(product.type)}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                      </h3>

                      {product.brand && (
                        <p className="text-sm text-gray-600 mb-2">Brand: {product.brand}</p>
                      )}

                      {product.condition && (
                        <p className="text-sm text-gray-600 mb-2">Condition: {product.condition}</p>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <div>
                          {Number(product.discount || 0) > 0 && (
                            <p className="text-sm text-gray-500 line-through">
                              ₹{Number(product.price || 0).toLocaleString()}
                            </p>
                          )}
                          <p className="text-xl font-bold text-blue-600">
                            ₹{Number(product.finalPrice || product.price || 0).toLocaleString()}
                          </p>
                          {Number(product.discount || 0) > 0 && (
                            <p className="text-xs text-green-600 font-semibold">
                              {product.discount}% OFF
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="px-4 pb-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SearchResults;
