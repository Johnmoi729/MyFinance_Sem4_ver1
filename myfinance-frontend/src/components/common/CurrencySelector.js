import React, { useState, useEffect } from 'react';
import { usePreferences } from '../../context/PreferencesContext';

/**
 * CurrencySelector Component
 *
 * A dropdown selector for choosing currency with visual indicators
 * Supports 10 currencies: VND, USD, EUR, JPY, GBP, CNY, KRW, THB, SGD, MYR
 *
 * Props:
 * - value: Current selected currency code (e.g., "USD")
 * - onChange: Callback function when currency changes
 * - label: Label text for the selector (optional)
 * - required: Whether the field is required (default: false)
 * - className: Additional CSS classes (optional)
 * - showSymbol: Show currency symbol next to code (default: true)
 */
const CurrencySelector = ({
    value,
    onChange,
    label = "Loại tiền",
    required = false,
    className = "",
    showSymbol = true
}) => {
    const { getCurrency } = usePreferences();
    const [selectedCurrency, setSelectedCurrency] = useState(value || getCurrency() || 'VND');

    // Currency configurations with symbols and names
    const currencies = [
        { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
        { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
        { code: 'KRW', symbol: '₩', name: 'Korean Won' },
        { code: 'THB', symbol: '฿', name: 'Thai Baht' },
        { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
        { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' }
    ];

    // Update local state when value prop changes
    useEffect(() => {
        if (value) {
            setSelectedCurrency(value);
        }
    }, [value]);

    const handleChange = (e) => {
        const newCurrency = e.target.value;
        setSelectedCurrency(newCurrency);
        if (onChange) {
            onChange(newCurrency);
        }
    };

    const getCurrencySymbol = (code) => {
        const currency = currencies.find(c => c.code === code);
        return currency ? currency.symbol : '';
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    value={selectedCurrency}
                    onChange={handleChange}
                    required={required}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                >
                    {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                            {showSymbol ? `${currency.symbol} ${currency.code}` : currency.code} - {currency.name}
                        </option>
                    ))}
                </select>
                {showSymbol && (
                    <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none text-gray-500 text-lg">
                        {getCurrencySymbol(selectedCurrency)}
                    </div>
                )}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
                Chọn loại tiền cho giao dịch này
            </p>
        </div>
    );
};

export default CurrencySelector;
