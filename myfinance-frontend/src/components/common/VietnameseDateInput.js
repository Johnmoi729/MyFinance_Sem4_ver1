import React, { useState, useEffect } from 'react';

const VietnameseDateInput = ({ 
 value, 
 onChange, 
 placeholder = "dd/mm/yyyy", 
 className = "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
}) => {
 const [displayValue, setDisplayValue] = useState('');

 // Convert ISO date (yyyy-mm-dd) to Vietnamese format (dd/mm/yyyy)
 const isoToVietnamese = (isoDate) => {
 if (!isoDate) return '';
 const [year, month, day] = isoDate.split('-');
 return `${day}/${month}/${year}`;
 };

 // Convert Vietnamese format (dd/mm/yyyy) to ISO date (yyyy-mm-dd)
 const vietnameseToIso = (vietnameseDate) => {
 if (!vietnameseDate) return '';
 const parts = vietnameseDate.replace(/\D/g, ''); // Remove non-digits
 if (parts.length === 8) {
 const day = parts.substring(0, 2);
 const month = parts.substring(2, 4);
 const year = parts.substring(4, 8);
 
 // Validate date components
 const dayNum = parseInt(day);
 const monthNum = parseInt(month);
 const yearNum = parseInt(year);
 
 if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2100) {
 return `${year}-${month}-${day}`;
 }
 }
 return '';
 };

 // Format input as user types
 const formatAsVietnamese = (input) => {
 const numbers = input.replace(/\D/g, ''); // Remove non-digits
 let formatted = '';
 
 if (numbers.length > 0) {
 formatted = numbers.substring(0, 2);
 if (numbers.length > 2) {
 formatted += '/' + numbers.substring(2, 4);
 if (numbers.length > 4) {
 formatted += '/' + numbers.substring(4, 8);
 }
 }
 }
 
 return formatted;
 };

 // Initialize display value when prop value changes
 useEffect(() => {
 setDisplayValue(isoToVietnamese(value));
 }, [value]);

 const handleInputChange = (e) => {
 const inputValue = e.target.value;
 const formatted = formatAsVietnamese(inputValue);
 setDisplayValue(formatted);
 
 // Convert to ISO format and call onChange
 const isoDate = vietnameseToIso(formatted);
 onChange(isoDate);
 };

 const handleKeyPress = (e) => {
 // Only allow numbers and forward slashes
 if (!/[\d/]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
 e.preventDefault();
 }
 };

 return (
 <input
 type="text"
 value={displayValue}
 onChange={handleInputChange}
 onKeyDown={handleKeyPress}
 placeholder={placeholder}
 className={className}
 maxLength={10} // dd/mm/yyyy = 10 characters
 />
 );
};

export default VietnameseDateInput;