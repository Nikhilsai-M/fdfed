import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContent';
import { buildApiUrl, buildAssetUrl } from '../utils/api';

const SEARCH_DEBOUNCE_MS = 300;

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateCart } = useCart();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(Boolean(query));
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(query);
  const activeRequestRef = useRef(0);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    const trimmed = searchInput.trim();

    const timeoutId = window.setTimeout(() => {
      if (trimmed === query) {
        return;
      }

      if (!trimmed) {
        setSearchParams({}, { replace: true });
        return;
      }

      setSearchParams({ q: trimmed }, { replace: true });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [query, searchInput, setSearchParams]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    const requestId = activeRequestRef.current + 1;
    activeRequestRef.current = requestId;
    const controller = new AbortController();

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(buildApiUrl(`/api/search?q=${encodeURIComponent(trimmedQuery)}`), {
          credentials: 'include',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data = await response.json();

        if (activeRequestRef.current !== requestId) {
          return;
        }

        setResults(data.results || []);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        if (activeRequestRef.current !== requestId) {
          return;
        }

        setError(err.message);
        setResults([]);
        console.error('Error fetching search results:', err);
      } finally {
        if (activeRequestRef.current === requestId) {
          setLoading(false);
        }
      }
    };

    fetchSearchResults();

    return () => controller.abort();
  }, [query]);

  const resultLabel = useMemo(() => {
    if (!query || loading || error) {
      return null;
    }

    return `Found ${results.length} ${results.length === 1 ? 'result' : 'results'}`;
  }, [error, loading, query, results.length]);

  const handleAddToCart = async (product) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        navigate('/sign-in');
        return;
      }

      const response = await fetch(buildApiUrl('/api/orders/cart'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId: product.id,
          productType: product.type,
          quantity: 1,
          price: product.finalPrice,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      updateCart();
      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart');
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {query ? `Search Results for "${query}"` : 'Search Products'}
            </h1>

            <div className="max-w-2xl">
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                <i className="fa-solid fa-magnifying-glass text-gray-400 mr-3"></i>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search phones, laptops, accessories and more"
                  className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            {resultLabel && (
              <p className="text-gray-600 mt-4">{resultLabel}</p>
            )}
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Searching Meilisearch...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}

          {!loading && !error && results.length === 0 && query && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">Search</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No results found</h2>
              <p className="text-gray-600 mb-6">
                We could not find any products matching "{query}"
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
                        src={buildAssetUrl(product.image)}
                        alt={product.title}
                        className="w-full h-48 object-contain"
                        onError={(event) => {
                          event.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
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
                          {product.discount > 0 && (
                            <p className="text-sm text-gray-500 line-through">
                              Rs {product.price.toLocaleString()}
                            </p>
                          )}
                          <p className="text-xl font-bold text-blue-600">
                            Rs {product.finalPrice.toLocaleString()}
                          </p>
                          {product.discount > 0 && (
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
                      onClick={(event) => {
                        event.preventDefault();
                        handleAddToCart(product);
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
