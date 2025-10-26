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
    types: ["USB-B", "USB-C", "Lightning"],
    outputCurrents: [
      { label: "1A", value: "1A" },
      { label: "2A", value: "2A" },
      { label: "2.4A", value: "2.4A" },
      { label: "3A", value: "3A" },
      { label: "5A", value: "5A" },
    ],
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

  const renderSection = (sectionKey, title, items, isObject = false) => (
    <div className="border-b border-gray-200 pb-3 mb-3">
      <button
        onClick={() => onToggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors"
      >
        <span>{title}</span>
        {expandedSections[sectionKey] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {expandedSections[sectionKey] && (
        <div className="space-y-2 animate-slideDown">
          {items.map((item) => (
            <label key={isObject ? item.value : item} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters[sectionKey].includes(isObject ? item.value : item)}
                onChange={() => toggleFilter(sectionKey, isObject ? item.value : item)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                {isObject ? item.label : item}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sticky top-4 animate-fadeIn">
      {/* Header */}
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

      {/* Brand */}
      {renderSection('brands', 'Brand', filterOptions.brands)}

      {/* Wattage */}
      {renderSection('wattages', 'Wattage', filterOptions.wattages, true)}

      {/* Type */}
      {renderSection('types', 'Type', filterOptions.types)}

      {/* Output Current (new section) */}
      {renderSection('outputCurrents', 'Output Current', filterOptions.outputCurrents, true)}

      {/* Discount */}
      {renderSection('discount', 'Discount', filterOptions.discount, true)}

      {/* Animations and Styling */}
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

        .sticky {
          top: 1rem;
        }

        .p-4 {
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ChargerFilter;
