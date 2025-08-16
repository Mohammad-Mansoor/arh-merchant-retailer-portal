import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { X, Filter, ChevronDown, Check } from 'lucide-react';

const FilterOption = ({ option, isSelected, multiSelect, onChange }) => (
  <div 
    className={`px-3 py-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center rounded ${
      isSelected ? 'bg-red-50 dark:bg-red-900/20' : ''
    }`}
    onClick={onChange}
  >
    {multiSelect && (
      <div className={`mr-2 w-5 h-5 flex items-center justify-center border rounded ${
        isSelected 
          ? 'bg-[#CD0202] border-[#CD0202]' 
          : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700'
      }`}>
        {isSelected && <Check className="text-white w-3 h-3" />}
      </div>
    )}
    <span className="text-gray-700 dark:text-gray-200">
      {option.label}
    </span>
  </div>
);

const RangeFilter = ({ config, value, onChange }) => {
  const { min: absMin, max: absMax, unit = '' } = config;
  const currentMin = value?.min || absMin;
  const currentMax = value?.max || absMax;
  
  const handleChange = (field, val) => {
    const numericValue = parseInt(val, 10);
    if (isNaN(numericValue)) return;
    
    onChange({
      ...value,
      [field]: Math.min(Math.max(numericValue, absMin), absMax)
    });
  };

return (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Min</label>
        <div className="relative">
          <input
            type="number"
            value={currentMin}
            onChange={(e) => handleChange('min', e.target.value)}
            min={absMin}
            max={currentMax}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                      focus:outline-none focus:border-[#CD0202] focus:ring-1 focus:ring-[#CD0202] focus:ring-opacity-50
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {unit && <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{unit}</span>}
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Max</label>
        <div className="relative">
          <input
            type="number"
            value={currentMax}
            onChange={(e) => handleChange('max', e.target.value)}
            min={currentMin}
            max={absMax}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                      focus:outline-none focus:border-[#CD0202] focus:ring-1 focus:ring-[#CD0202] focus:ring-opacity-50
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {unit && <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{unit}</span>}
        </div>
      </div>
    </div>

      
   
      {/* <div className="pt-1">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>{absMin} {unit}</span>
          <span>{absMax} {unit}</span>
        </div>
        <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div 
            className="absolute top-0 h-full bg-[#CD0202] rounded-full"
            style={{
              left: `${((currentMin - absMin) / (absMax - absMin)) * 100}%`,
              width: `${((currentMax - currentMin) / (absMax - absMin)) * 100}%`,
            }}
          />
        </div>
      </div> */}
    </div>
  );
};

const DropdownFilter = ({ config, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const selectedOption = config.options.find(opt => opt.value === value);
  const selectedCount = Array.isArray(value) ? value.length : 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:border-[#CD0202] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {config.multiSelect 
            ? selectedCount > 0 
              ? `${selectedCount} selected` 
              : 'Select options'
            : selectedOption?.label || 'Select option'
          }
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md border border-gray-200 dark:border-gray-600 max-h-60 overflow-y-auto">
          {config.options.map(option => (
            <FilterOption
              key={option.value}
              option={option}
              isSelected={config.multiSelect 
                ? value?.includes(option.value) 
                : value === option.value}
              multiSelect={config.multiSelect}
              onChange={() => {
                if (config.multiSelect) {
                  const newValue = value?.includes(option.value)
                    ? value.filter(v => v !== option.value)
                    : [...(value || []), option.value];
                  onChange(newValue);
                } else {
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CheckboxFilter = ({ config, value, onChange }) => (
  <div className="space-y-2">
    {config.options.map(option => (
      <div key={option.value} className="flex items-center">
        <input
          type="checkbox"
          id={`${config.key}-${option.value}`}
          checked={value?.includes(option.value) || false}
          onChange={() => onChange(option.value)}
          className="w-4 h-4 text-[#CD0202] rounded focus:ring-[#CD0202] border-gray-300 dark:border-gray-600"
        />
        <label 
          htmlFor={`${config.key}-${option.value}`}
          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
        >
          {option.label}
        </label>
      </div>
    ))}
  </div>
);

const ARHAdvanceFilterModal = ({
  isOpen,
  onClose,
  onApply,
  filterConfig = [],
  initialValues = {}
}) => {
  const [filterValues, setFilterValues] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const defaults = {};
    filterConfig.forEach(config => {
      if (initialValues[config.key] !== undefined) {
        defaults[config.key] = initialValues[config.key];
      } else if (config.type === 'checkbox' || config.type === 'dropdown') {
        defaults[config.key] = config.multiSelect ? [] : '';
      } else if (config.type === 'range') {
        defaults[config.key] = { 
          min: config.min || 0, 
          max: config.max || 100 
        };
      }
    });
    
    setFilterValues(defaults);
  }, [isOpen, filterConfig, initialValues]);

  const handleFilterChange = useCallback((key, value) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleApply = useCallback(() => {
    onApply(filterValues);
    onClose();
  }, [filterValues, onApply, onClose]);

  const handleReset = useCallback(() => {
    const resetValues = {};
    filterConfig.forEach(config => {
      if (config.type === 'checkbox' || config.type === 'dropdown') {
        resetValues[config.key] = config.multiSelect ? [] : '';
      } else if (config.type === 'range') {
        resetValues[config.key] = { min: config.min || 0, max: config.max || 100 };
      }
    });
    setFilterValues(resetValues);
  }, [filterConfig]);

  const isAnyFilterApplied = useMemo(() => {
    return filterConfig.some(config => {
      const value = filterValues[config.key];
      
      if (config.type === 'checkbox' || config.type === 'dropdown') {
        return Array.isArray(value) ? value.length > 0 : !!value;
      }
      
      if (config.type === 'range') {
        const defaultMin = config.min || 0;
        const defaultMax = config.max || 100;
        return value?.min !== defaultMin || value?.max !== defaultMax;
      }
      
      return false;
    });
  }, [filterValues, filterConfig]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 w-[500px] rounded-xl  max-w-2xl max-h-[90vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
        ref={dropdownRef}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Filter className="text-[#CD0202] dark:text-[#CD0202]" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Advanced Filter</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close filter"
          >
            <X className="text-gray-500 dark:text-gray-300" size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-grow p-6">
          <div className="grid grid-cols-1 gap-6">
            {filterConfig.map((config) => (
              <div key={config.key} className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {config.label}
                </label>
                
                {config.type === 'dropdown' && (
                  <DropdownFilter
                    config={config}
                    value={filterValues[config.key]}
                    onChange={(value) => handleFilterChange(config.key, value)}
                  />
                )}
                
                {config.type === 'checkbox' && (
                  <CheckboxFilter
                    config={config}
                    value={filterValues[config.key]}
                    onChange={(optionValue) => {
                      const current = filterValues[config.key] || [];
                      const newValue = current.includes(optionValue)
                        ? current.filter(v => v !== optionValue)
                        : [...current, optionValue];
                      handleFilterChange(config.key, newValue);
                    }}
                  />
                )}
                
                {config.type === 'range' && (
                  <RangeFilter
                    config={config}
                    value={filterValues[config.key]}
                    onChange={(value) => handleFilterChange(config.key, value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between p-4 border-t dark:border-gray-700">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Reset All
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className={`px-4 py-2 bg-[#CD0202] text-white rounded-md hover:bg-[#a80101] transition-colors ${
                !isAnyFilterApplied ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!isAnyFilterApplied}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARHAdvanceFilterModal;