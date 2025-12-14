/**
 * Date formatter hook - uses Vietnamese format (dd/MM/yyyy)
 * Returns functions to format dates in Vietnamese standard format
 */
export const useDateFormatter = () => {
 /**
 * Format a date in Vietnamese format (dd/MM/yyyy)
 * @param {Date|string|number} date - The date to format
 * @param {string} formatOverride - Optional format override
 * @returns {string} Formatted date string
 */
 const formatDate = (date, formatOverride = null) => {
 if (!date) return '';

 const format = formatOverride || 'dd/MM/yyyy'; // Hardcoded to Vietnamese format
 const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

 // Validate date
 if (isNaN(dateObj.getTime())) {
 return '';
 }

 const day = String(dateObj.getDate()).padStart(2, '0');
 const month = String(dateObj.getMonth() + 1).padStart(2, '0');
 const year = dateObj.getFullYear();

 // Apply format pattern
 switch (format) {
 case 'dd/MM/yyyy':
 return `${day}/${month}/${year}`;
 case 'MM/dd/yyyy':
 return `${month}/${day}/${year}`;
 case 'yyyy-MM-dd':
 return `${year}-${month}-${day}`;
 case 'dd-MM-yyyy':
 return `${day}-${month}-${year}`;
 case 'yyyy/MM/dd':
 return `${year}/${month}/${day}`;
 default:
 return `${day}/${month}/${year}`; // Default to Vietnamese format
 }
 };

 /**
 * Format a date with time
 * @param {Date|string|number} date - The date to format
 * @param {boolean} includeSeconds - Whether to include seconds
 * @returns {string} Formatted date-time string
 */
 const formatDateTime = (date, includeSeconds = false) => {
 if (!date) return '';

 const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

 if (isNaN(dateObj.getTime())) {
 return '';
 }

 const datePart = formatDate(dateObj);
 const hours = String(dateObj.getHours()).padStart(2, '0');
 const minutes = String(dateObj.getMinutes()).padStart(2, '0');
 const seconds = String(dateObj.getSeconds()).padStart(2, '0');

 if (includeSeconds) {
 return `${datePart} ${hours}:${minutes}:${seconds}`;
 } else {
 return `${datePart} ${hours}:${minutes}`;
 }
 };

 /**
 * Format date for input field (always returns yyyy-MM-dd for HTML date input)
 * @param {Date|string|number} date - The date to format
 * @returns {string} Date in yyyy-MM-dd format
 */
 const formatDateForInput = (date) => {
 if (!date) return '';

 const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

 if (isNaN(dateObj.getTime())) {
 return '';
 }

 const year = dateObj.getFullYear();
 const month = String(dateObj.getMonth() + 1).padStart(2, '0');
 const day = String(dateObj.getDate()).padStart(2, '0');

 return `${year}-${month}-${day}`;
 };

 /**
 * Parse a date string in Vietnamese format (dd/MM/yyyy)
 * @param {string} dateString - The date string to parse
 * @param {string} formatOverride - Optional format override
 * @returns {Date|null} Parsed Date object or null if invalid
 */
 const parseDate = (dateString, formatOverride = null) => {
 if (!dateString) return null;

 const format = formatOverride || 'dd/MM/yyyy'; // Hardcoded to Vietnamese format
 const parts = dateString.split(/[/-]/);

 if (parts.length !== 3) {
 return null;
 }

 let day, month, year;

 switch (format) {
 case 'dd/MM/yyyy':
 case 'dd-MM-yyyy':
 [day, month, year] = parts;
 break;
 case 'MM/dd/yyyy':
 [month, day, year] = parts;
 break;
 case 'yyyy-MM-dd':
 case 'yyyy/MM/dd':
 [year, month, day] = parts;
 break;
 default:
 [day, month, year] = parts; // Default to Vietnamese format
 }

 const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

 // Validate the date
 if (isNaN(date.getTime())) {
 return null;
 }

 return date;
 };

 /**
 * Get relative time string (e.g., "2 hours ago", "yesterday")
 * @param {Date|string|number} date - The date to compare
 * @returns {string} Relative time string in Vietnamese
 */
 const getRelativeTime = (date) => {
 if (!date) return '';

 const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

 if (isNaN(dateObj.getTime())) {
 return '';
 }

 const now = new Date();
 const diffMs = now - dateObj;
 const diffSec = Math.floor(diffMs / 1000);
 const diffMin = Math.floor(diffSec / 60);
 const diffHour = Math.floor(diffMin / 60);
 const diffDay = Math.floor(diffHour / 24);

 if (diffSec < 60) {
 return 'Vừa xong';
 } else if (diffMin < 60) {
 return `${diffMin} phút trước`;
 } else if (diffHour < 24) {
 return `${diffHour} giờ trước`;
 } else if (diffDay === 1) {
 return 'Hôm qua';
 } else if (diffDay < 7) {
 return `${diffDay} ngày trước`;
 } else if (diffDay < 30) {
 const weeks = Math.floor(diffDay / 7);
 return `${weeks} tuần trước`;
 } else if (diffDay < 365) {
 const months = Math.floor(diffDay / 30);
 return `${months} tháng trước`;
 } else {
 const years = Math.floor(diffDay / 365);
 return `${years} năm trước`;
 }
 };

 /**
 * Format month name in Vietnamese
 * @param {number} month - Month number (1-12)
 * @returns {string} Vietnamese month name
 */
 const getVietnameseMonthName = (month) => {
 const monthNames = [
 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
 ];

 return monthNames[month - 1] || '';
 };

 /**
 * Format a date range
 * @param {Date|string|number} startDate - Start date
 * @param {Date|string|number} endDate - End date
 * @returns {string} Formatted date range
 */
 const formatDateRange = (startDate, endDate) => {
 const start = formatDate(startDate);
 const end = formatDate(endDate);

 if (!start && !end) return '';
 if (!end) return start;
 if (!start) return end;

 return `${start} - ${end}`;
 };

 /**
 * Check if a date is today
 * @param {Date|string|number} date - Date to check
 * @returns {boolean}
 */
 const isToday = (date) => {
 if (!date) return false;

 const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
 const today = new Date();

 return dateObj.getDate() === today.getDate() &&
 dateObj.getMonth() === today.getMonth() &&
 dateObj.getFullYear() === today.getFullYear();
 };

 /**
 * Check if a date is in the current month
 * @param {Date|string|number} date - Date to check
 * @returns {boolean}
 */
 const isCurrentMonth = (date) => {
 if (!date) return false;

 const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
 const today = new Date();

 return dateObj.getMonth() === today.getMonth() &&
 dateObj.getFullYear() === today.getFullYear();
 };

 /**
 * Get the first day of the current month
 * @returns {Date}
 */
 const getFirstDayOfMonth = () => {
 const today = new Date();
 return new Date(today.getFullYear(), today.getMonth(), 1);
 };

 /**
 * Get the last day of the current month
 * @returns {Date}
 */
 const getLastDayOfMonth = () => {
 const today = new Date();
 return new Date(today.getFullYear(), today.getMonth() + 1, 0);
 };

 return {
 formatDate,
 formatDateTime,
 formatDateForInput,
 parseDate,
 getRelativeTime,
 getVietnameseMonthName,
 formatDateRange,
 isToday,
 isCurrentMonth,
 getFirstDayOfMonth,
 getLastDayOfMonth
 };
};

/**
 * Standalone date formatter (without hook)
 * Use this in non-React contexts
 */
export const formatDateStandalone = (date, format = 'dd/MM/yyyy') => {
 if (!date) return '';

 const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

 if (isNaN(dateObj.getTime())) {
 return '';
 }

 const day = String(dateObj.getDate()).padStart(2, '0');
 const month = String(dateObj.getMonth() + 1).padStart(2, '0');
 const year = dateObj.getFullYear();

 switch (format) {
 case 'dd/MM/yyyy':
 return `${day}/${month}/${year}`;
 case 'MM/dd/yyyy':
 return `${month}/${day}/${year}`;
 case 'yyyy-MM-dd':
 return `${year}-${month}-${day}`;
 case 'dd-MM-yyyy':
 return `${day}-${month}-${year}`;
 case 'yyyy/MM/dd':
 return `${year}/${month}/${day}`;
 default:
 return `${day}/${month}/${year}`;
 }
};

/**
 * Format date-time standalone
 */
export const formatDateTimeStandalone = (date, includeSeconds = false) => {
 if (!date) return '';

 const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

 if (isNaN(dateObj.getTime())) {
 return '';
 }

 const datePart = formatDateStandalone(dateObj);
 const hours = String(dateObj.getHours()).padStart(2, '0');
 const minutes = String(dateObj.getMinutes()).padStart(2, '0');
 const seconds = String(dateObj.getSeconds()).padStart(2, '0');

 if (includeSeconds) {
 return `${datePart} ${hours}:${minutes}:${seconds}`;
 } else {
 return `${datePart} ${hours}:${minutes}`;
 }
};
