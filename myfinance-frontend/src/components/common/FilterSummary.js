import React from 'react';
import { X } from '../icons';
import { useDateFormatter } from '../../utils/dateFormatter';

const FilterSummary = ({ filters, categories, onClearFilter }) => {
 const { formatDate } = useDateFormatter();

 const activeFilters = [];

 // Type filter
 if (filters.type) {
 activeFilters.push({
 key: 'type',
 label: filters.type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu',
 value: filters.type
 });
 }

 // Category filter
 if (filters.categoryId) {
 const category = categories.find(c => c.id === parseInt(filters.categoryId));
 if (category) {
 activeFilters.push({
 key: 'categoryId',
 label: `Danh mục: ${category.name}`,
 value: filters.categoryId
 });
 }
 }

 // Date range filter
 if (filters.startDate && filters.endDate) {
 activeFilters.push({
 key: 'dateRange',
 label: `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}`,
 value: 'dateRange'
 });
 } else if (filters.startDate) {
 activeFilters.push({
 key: 'startDate',
 label: `Từ: ${formatDate(filters.startDate)}`,
 value: filters.startDate
 });
 } else if (filters.endDate) {
 activeFilters.push({
 key: 'endDate',
 label: `Đến: ${formatDate(filters.endDate)}`,
 value: filters.endDate
 });
 }

 // Search term filter
 if (filters.searchTerm) {
 activeFilters.push({
 key: 'searchTerm',
 label: `Tìm kiếm: "${filters.searchTerm}"`,
 value: filters.searchTerm
 });
 }

 if (activeFilters.length === 0) return null;

 return (
 <div className="mb-4 flex flex-wrap items-center gap-2">
 <span className="text-sm font-medium text-gray-600">Bộ lọc đang áp dụng:</span>
 {activeFilters.map((filter, index) => (
 <span
 key={index}
 className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
 >
 {filter.label}
 <button
 onClick={() => onClearFilter(filter.key)}
 className="ml-1 hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
 title="Xóa bộ lọc"
 >
 <X className="w-3 h-3" />
 </button>
 </span>
 ))}
 </div>
 );
};

export default FilterSummary;
