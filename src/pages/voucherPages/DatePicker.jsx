// components/common/DatePicker.jsx
import React from 'react';
import XCalendar from './calendar';

/**
 * A reusable date picker component that handles date selection and formatting
 * @param {Object} props - Component props
 * @param {Date} props.selectedDate - Currently selected date
 * @param {Function} props.onDateChange - Function to call when date changes (returns formatted date string)
 * @param {String} props.format - Date format (default: 'YYYY-MM-DD')
 * @param {String} props.className - Additional CSS classes for the container
 * @param {String} props.title - Title text to display above calendar (optional)
 */
function DatePicker({ 
  selectedDate = new Date(), 
  onDateChange, 
  format = 'YYYY-MM-DD',
  className = '',
  title = 'Select Date'
}) {
  const handleDateSelect = (date) => {
    // Format the date based on the specified format
    let formattedDate;
    
    if (format === 'YYYY-MM-DD') {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    } else if (format === 'DD/MM/YYYY') {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      formattedDate = `${day}/${month}/${year}`;
    } else if (format === 'MM/DD/YYYY') {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      formattedDate = `${month}/${day}/${year}`;
    } else {
      // Default to ISO format without time
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    }
    
    // Call the parent's onDateChange with both the raw date object and formatted string
    onDateChange(date, formattedDate);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {title && (
        <div className='mb-2 text-blue-800 font-semibold text-center pb-2 border-b border-blue-50'>
          {title}
        </div>
      )}
      <div className='flex justify-center items-center p-2'>
        <XCalendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md border border-blue-200"
        />
      </div>
    </div>
  );
}

export default DatePicker;