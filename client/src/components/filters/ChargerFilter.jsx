import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ChargerFilter = ({ 
  filters, 
  onFilterChange, 
  onClearAll, 
  expandedSections, 
  onToggleSection 
}) => {
  const filterOptions = {
    brands: ["Apple", "Samsung", "RoarX", "Pacificdeals", "EYNK", "Others"],
    wattages: [
      { label: "18W", value: "18" },
      { label: "20W", value: "20" },
      { label: "30W", value: "30" },
      { label: "45W", value: "45" },
      { label: "65W", value: "65" },
    ],
    types: ["USB-B", "USB-C", "lightning"],
    discount: [
      { label: "10% & above", value: 10 },
      { label: "30% & above", value: 30 },
      { label: "50% & above", value: 50 },
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

      {/* Wattage Filter */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => onToggleSection('wattage')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors"
        >
          <span>Wattage</span>
          {expandedSections.wattage ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {expandedSections.wattage && (
          <div className="space-y-2 animate-slideDown">
            {filterOptions.wattages.map((watt) => (
              <label key={watt.value} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.wattages.includes(watt.value)}
                  onChange={() => toggleFilter('wattages', watt.value)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                  {watt.label}
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

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 500px; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        /* Adjust sticky positioning */
        .sticky {
          top: 1rem; /* Reduced top offset to avoid overlap with header */
        }

        /* Reduce padding for compact filter */
        .p-4 {
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ChargerFilter;