import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const EarbudsFilter = ({ 
  filters, 
  onFilterChange, 
  onClearAll, 
  expandedSections, 
  onToggleSection 
}) => {
  const filterOptions = {
    brands: ["Boat", "SAMSUNG", "Portronics", "JBL", "Noise", "realme", "Boult", "OnePlus", "Others"],
    batteryLife: [
      { label: "20 hours & above", value: 20 },
      { label: "30 hours & above", value: 30 },
      { label: "40 hours & above", value: 40 },
      { label: "50 hours & above", value: 50 },
    ],
    designs: ["Earbuds", "behind the neck"],
    discount: [
      { label: "60% & above", value: 60 },
      { label: "71% & above", value: 71 },
      { label: "85% & above", value: 85 },
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

      {/* Battery Life Filter */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => onToggleSection('batteryLife')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors"
        >
          <span>Battery Life</span>
          {expandedSections.batteryLife ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {expandedSections.batteryLife && (
          <div className="space-y-2 animate-slideDown">
            {filterOptions.batteryLife.map((battery) => (
              <label key={battery.value} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.batteryLife.includes(battery.value)}
                  onChange={() => toggleFilter('batteryLife', battery.value)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                  {battery.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Design Filter */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => onToggleSection('design')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors"
        >
          <span>Design</span>
          {expandedSections.design ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {expandedSections.design && (
          <div className="space-y-2 animate-slideDown">
            {filterOptions.designs.map((design) => (
              <label key={design} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.designs.includes(design)}
                  onChange={() => toggleFilter('designs', design)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                  {design}
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

export default EarbudsFilter;