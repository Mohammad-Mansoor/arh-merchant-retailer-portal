// src/components/Filter/Calendar.jsx
import React, { useState } from 'react';
import './Filter.css';

const Calendar = ({ selectedRange, onSelectRange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const handleDateClick = (day) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (!selectedRange.from && !selectedRange.to) {
      onSelectRange({ from: clickedDate, to: null });
    } else if (selectedRange.from && !selectedRange.to) {
      if (clickedDate < selectedRange.from) {
        onSelectRange({ from: clickedDate, to: selectedRange.from });
      } else {
        onSelectRange({ ...selectedRange, to: clickedDate });
      }
    } else {
      onSelectRange({ from: clickedDate, to: null });
    }
  };
  
  const isInRange = (day) => {
    if (!selectedRange.from || !selectedRange.to) return false;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date >= selectedRange.from && date <= selectedRange.to;
  };
  
  const isStartDate = (day) => {
    if (!selectedRange.from) return false;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.getTime() === selectedRange.from.getTime();
  };
  
  const isEndDate = (day) => {
    if (!selectedRange.to) return false;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.getTime() === selectedRange.to.getTime();
  };
  
  const isSelected = (day) => {
    return isStartDate(day) || isEndDate(day);
  };
  
  // Generate calendar days
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const days = [];
  
  // Previous month days
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = 0; i < firstDay; i++) {
    days.push(
      <div key={`prev-${i}`} className="calendar-day empty">
        {prevMonthDays - firstDay + i + 1}
      </div>
    );
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const inRange = isInRange(day);
    const selected = isSelected(day);
    const start = isStartDate(day);
    const end = isEndDate(day);
    
    days.push(
      <div 
        key={day}
        className={`calendar-day 
          ${inRange ? 'in-range' : ''} 
          ${selected ? 'selected' : ''}
          ${start ? 'start-date' : ''}
          ${end ? 'end-date' : ''}
        `}
        onClick={() => handleDateClick(day)}
      >
        {day}
      </div>
    );
  }
  
  // Next month days
  const totalCells = 42; // 6 weeks * 7 days
  const nextMonthDays = totalCells - days.length;
  for (let i = 1; i <= nextMonthDays; i++) {
    days.push(
      <div key={`next-${i}`} className="calendar-day empty">
        {i}
      </div>
    );
  }
  
  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="nav-button" onClick={prevMonth}>&lt;</button>
        <h3>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button className="nav-button" onClick={nextMonth}>&gt;</button>
      </div>
      
      <div className="calendar-weekdays">
        {daysOfWeek.map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      
      <div className="calendar-days">
        {days}
      </div>
    </div>
  );
};

export default Calendar;