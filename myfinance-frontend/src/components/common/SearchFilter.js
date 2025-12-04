import React from 'react';
import { Search, Filter, X, Calendar, Tag } from '../icons';

/**
 * Unified Search and Filter Component
 * Used across the application for consistent search/filter UI
 *
 * @param {Object} props
 * @param {string} props.searchTerm - Current search value
 * @param {function} props.onSearchChange - Search input change handler
 * @param {function} props.onSearchClear - Clear search handler
 * @param {string} props.searchPlaceholder - Search input placeholder
 * @param {Array} props.filterOptions - Array of filter button options
 * @param {string} props.activeFilter - Currently active filter
 * @param {function} props.onFilterChange - Filter change handler
 * @param {boolean} props.useDropdown - Use dropdown instead of buttons for filters (for many options)
 * @param {string} props.dropdownLabel - Label for dropdown filter
 * @param {boolean} props.showDateFilter - Show date range filter
 * @param {Object} props.dateRange - Date range object {startDate, endDate}
 * @param {function} props.onDateChange - Date change handler
 * @param {Array} props.customFilters - Additional custom filter components
 */
const SearchFilter = ({
    // Search props
    searchTerm = '',
    searchValue, // Backward compatibility
    onSearchChange,
    onSearchClear,
    searchPlaceholder = 'Tìm kiếm...',

    // Filter props
    filterOptions = [],
    activeFilter = '',
    onFilterChange,
    useDropdown = false,
    dropdownLabel = 'Lọc theo',

    // Date filter props
    showDateFilter = false,
    dateRange = { startDate: '', endDate: '' },
    onDateChange,

    // Custom filters
    customFilters = []
}) => {
    // Support both searchTerm and searchValue for backward compatibility
    const currentSearchValue = searchValue !== undefined ? searchValue : searchTerm;
    return (
        <div className="space-y-4">
            {/* Search Bar */}
            {onSearchChange && (
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={currentSearchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                    {currentSearchValue && onSearchClear && (
                        <button
                            onClick={onSearchClear}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            title="Xóa tìm kiếm"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            )}

            {/* Filter Buttons & Date Range */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Filter Buttons or Dropdown */}
                {filterOptions.length > 0 && (
                    useDropdown ? (
                        // Dropdown Mode (for many options)
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-600" />
                            <select
                                value={activeFilter}
                                onChange={(e) => onFilterChange(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            >
                                {filterOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        // Button Mode (for few options)
                        <div className="flex flex-wrap gap-2">
                            {filterOptions.map((option) => {
                                const IconComponent = option.icon;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => onFilterChange(option.value)}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                                            activeFilter === option.value
                                                ? option.activeClass || 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                        }`}
                                    >
                                        {IconComponent && <IconComponent className="w-4 h-4" />}
                                        {option.label}
                                        {option.count !== undefined && (
                                            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                                                activeFilter === option.value
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {option.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )
                )}

                {/* Date Range Filter */}
                {showDateFilter && onDateChange && (
                    <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-xl">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) => onDateChange({ ...dateRange, startDate: e.target.value })}
                                className="text-sm border-0 focus:ring-0 p-0 w-32"
                            />
                        </div>
                        <span className="text-gray-500">-</span>
                        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-xl">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) => onDateChange({ ...dateRange, endDate: e.target.value })}
                                className="text-sm border-0 focus:ring-0 p-0 w-32"
                            />
                        </div>
                    </div>
                )}

                {/* Custom Filters */}
                {customFilters.length > 0 && (
                    <div className="flex items-center gap-2">
                        {customFilters.map((customFilter, index) => (
                            <div key={index}>{customFilter}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchFilter;
