// src/components/Filter/Filter.jsx
import React, { useState } from 'react';
import DateFilterModal from './DateFilterModal';
import './Filter.css';

const Filter = ({ 
  statusOptions = ['All', 'Pending', 'Completed', 'Rejected'],
  onFilterChange 
}) => {
  const [filters, setFilters] = useState({
    status: 'All',
    amountFrom: '',
    amountTo: '',
    dateRange: { from: null, to: null }
  });
  
  const [showDateModal, setShowDateModal] = useState(false);

  const handleStatusChange = (status) => {
    const newFilters = { ...filters, status };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmountChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Only trigger filter if both values are filled or both are empty
    if ((filters.amountFrom && filters.amountTo) || (!value && !filters[name === 'amountFrom' ? 'amountTo' : 'amountFrom'])) {
      onFilterChange(newFilters);
    }
  };

  const handleDateSelect = (dateRange) => {
    const newFilters = { ...filters, dateRange };
    setFilters(newFilters);
    setShowDateModal(false);
    onFilterChange(newFilters);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="filter-container">
      <div className="filter-section">
        <h3 className="filter-title">Status</h3>
        <div className="status-filters">
          {statusOptions.map(status => (
            <button
              key={status}
              className={`status-filter ${filters.status === status ? 'active' : ''}`}
              onClick={() => handleStatusChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Amount</h3>
        <div className="amount-filter">
          <div className="amount-input-group">
            <label>From</label>
            <input
              type="number"
              name="amountFrom"
              value={filters.amountFrom}
              onChange={handleAmountChange}
              placeholder="0.00"
            />
          </div>
          <div className="amount-input-group">
            <label>To</label>
            <input
              type="number"
              name="amountTo"
              value={filters.amountTo}
              onChange={handleAmountChange}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <button 
          className="date-filter-button"
          onClick={() => setShowDateModal(true)}
        >
          By Date
        </button>
        <div className="date-display">
          {filters.dateRange.from || filters.dateRange.to ? (
            <span>
              {formatDate(filters.dateRange.from)} - {formatDate(filters.dateRange.to)}
            </span>
          ) : (
            <span>Select date range</span>
          )}
        </div>
      </div>

      {showDateModal && (
        <DateFilterModal 
          onClose={() => setShowDateModal(false)}
          onSelect={handleDateSelect}
          initialRange={filters.dateRange}
        />
      )}
    </div>
  );
};

export default Filter;