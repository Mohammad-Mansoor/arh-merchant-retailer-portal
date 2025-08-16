// src/components/Filter/DateFilterModal.jsx
import React, { useState } from 'react';

import './Filter.css';
import Calendar from './Calender';

const DateFilterModal = ({ onClose, onSelect, initialRange }) => {
  const [dateRange, setDateRange] = useState(initialRange);
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' or 'range'
  
  const setQuickRange = (rangeType) => {
    const today = new Date();
    const range = { from: null, to: null };
    
    switch(rangeType) {
      case 'thisWeek':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1);
        range.from = new Date(startOfWeek);
        range.to = new Date(startOfWeek);
        range.to.setDate(startOfWeek.getDate() + 6);
        break;
        
      case 'lastWeek':
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - today.getDay() - 6);
        range.from = new Date(lastWeek);
        range.to = new Date(lastWeek);
        range.to.setDate(lastWeek.getDate() + 6);
        break;
        
      case 'thisMonth':
        range.from = new Date(today.getFullYear(), today.getMonth(), 1);
        range.to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
        
      case 'lastMonth':
        range.from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        range.to = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
        
      case 'thisYear':
        range.from = new Date(today.getFullYear(), 0, 1);
        range.to = new Date(today.getFullYear(), 11, 31);
        break;
        
      case 'lastYear':
        range.from = new Date(today.getFullYear() - 1, 0, 1);
        range.to = new Date(today.getFullYear() - 1, 11, 31);
        break;
        
      default:
        break;
    }
    
    setDateRange(range);
  };
  
  const handleApply = () => {
    if (dateRange.from && dateRange.to) {
      onSelect(dateRange);
    }
  };
  
  return (
    <div className="modal-backdrop">
      <div className="date-modal">
        <div className="modal-header">
          <h2>By Date</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'quick' ? 'active' : ''}`}
            onClick={() => setActiveTab('quick')}
          >
            Quick Select
          </button>
          <button 
            className={`tab ${activeTab === 'range' ? 'active' : ''}`}
            onClick={() => setActiveTab('range')}
          >
            Date Range
          </button>
        </div>
        
        {activeTab === 'quick' && (
          <div className="quick-options">
            <div className="quick-row">
              <button onClick={() => setQuickRange('thisWeek')}>This Week</button>
              <button onClick={() => setQuickRange('lastWeek')}>Last Week</button>
            </div>
            <div className="quick-row">
              <button onClick={() => setQuickRange('thisMonth')}>This Month</button>
              <button onClick={() => setQuickRange('lastMonth')}>Last Month</button>
            </div>
            <div className="quick-row">
              <button onClick={() => setQuickRange('thisYear')}>This Year</button>
              <button onClick={() => setQuickRange('lastYear')}>Last Year</button>
            </div>
          </div>
        )}
        
        {activeTab === 'range' && (
          <div className="range-selector">
            <div className="date-inputs">
              <div className="input-group">
                <label>From</label>
                <input 
                  type="text" 
                  value={dateRange.from ? dateRange.from.toLocaleDateString() : ''} 
                  readOnly 
                />
              </div>
              <div className="input-group">
                <label>To</label>
                <input 
                  type="text" 
                  value={dateRange.to ? dateRange.to.toLocaleDateString() : ''} 
                  readOnly 
                />
              </div>
            </div>
            <Calendar 
              selectedRange={dateRange} 
              onSelectRange={setDateRange} 
            />
          </div>
        )}
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button 
            className="apply-button" 
            onClick={handleApply}
            disabled={!dateRange.from || !dateRange.to}
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateFilterModal;