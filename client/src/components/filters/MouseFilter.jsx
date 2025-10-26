import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './style.css'; // ✅ Import external CSS
const MouseFilter = ({ 
  filters, 
  onFilterChange, 
  onClearAll, 
  expandedSections, 
  onToggleSection 
}) => {
  const filterOptions = {
    brands: ["HP", "DELL", "Zebronics", "Arctic Fox", "Logitech", "Others"],
    types: ["Wired", "Wireless"],
    connectivity: ["USB", "Bluetooth & USB"],
    resolution: [
      { label: "1000 DPI & above", value: 1000 },
      { label: "2000 DPI & above", value: 2000 },
      { label: "3000 DPI & above", value: 3000 },
    ],
    discount: [
      { label: "10% & above", value: 10 },
      { label: "20% & above", value: 20 },
      { label: "30% & above", value: 30 },
    ],
  };

  const activeFilterCount = Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);

  const toggleFilter = (category, value) => {
    onFilterChange(category, value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sticky top-4 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Brand Filter */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => onToggleSection('brand')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors"
        >
          <span>Brand</span>
          {expandedSections.brand ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {expandedSections.brand && (
          <div className="space-y-2 animate-slideDown">
            {filterOptions.brands.map((brand) => (
              <label key={brand} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleFilter('brands', brand)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Type Filter */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => onToggleSection('type')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors"
        >
          <span>Type</span>
          {expandedSections.type ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {expandedSections.type && (
          <div className="space-y-2 animate-slideDown">
            {filterOptions.types.map((type) => (
              <label key={type} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.types.includes(type)}
                  onChange={() => toggleFilter('types', type)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                  {type}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Connectivity Filter */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => onToggleSection('connectivity')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors"
        >
          <span>Connectivity</span>
          {expandedSections.connectivity ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {expandedSections.connectivity && (
          <div className="space-y-2 animate-slideDown">
            {filterOptions.connectivity.map((conn) => (
              <label key={conn} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.connectivity.includes(conn)}
                  onChange={() => toggleFilter('connectivity', conn)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                  {conn}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Resolution Filter */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => onToggleSection('resolution')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors"
        >
          <span>Resolution</span>
          {expandedSections.resolution ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {expandedSections.resolution && (
          <div className="space-y-2 animate-slideDown">
            {filterOptions.resolution.map((res) => (
              <label key={res.value} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.resolution.includes(res.value)}
                  onChange={() => toggleFilter('resolution', res.value)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                  {res.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Discount Filter */}
      <div className="pb-2">
        <button
          onClick={() => onToggleSection('discount')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors"
        >
          <span>Discount</span>
          {expandedSections.discount ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {expandedSections.discount && (
          <div className="space-y-2 animate-slideDown">
            {filterOptions.discount.map((disc) => (
              <label key={disc.value} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.discount.includes(disc.value)}
                  onChange={() => toggleFilter('discount', disc.value)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                  {disc.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default MouseFilter;