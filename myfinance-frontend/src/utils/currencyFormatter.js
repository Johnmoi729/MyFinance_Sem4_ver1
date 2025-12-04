import { usePreferences } from '../context/PreferencesContext';

/**
 * Currency formatter hook that uses user preferences
 * Returns a function to format amounts based on user's preferred currency
 */
export const useCurrencyFormatter = () => {
    const { getCurrency } = usePreferences();

    /**
     * Format an amount according to user's currency preference
     * @param {number|string} amount - The amount to format
     * @param {string} currencyCode - Optional currency override (default: user preference)
     * @returns {string} Formatted currency string
     */
    const formatCurrency = (amount, currencyCode = null) => {
        const currency = currencyCode || getCurrency();
        const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

        // Handle invalid amounts
        if (isNaN(numericAmount)) {
            return '0 ₫';
        }

        try {
            // Currency-specific formatters using Intl.NumberFormat
            const formatters = {
                'VND': (amt) => {
                    return new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(amt);
                },
                'USD': (amt) => {
                    return new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(amt);
                },
                'EUR': (amt) => {
                    return new Intl.NumberFormat('de-DE', {
                        style: 'currency',
                        currency: 'EUR',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(amt);
                },
                'JPY': (amt) => {
                    return new Intl.NumberFormat('ja-JP', {
                        style: 'currency',
                        currency: 'JPY',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(amt);
                },
                'GBP': (amt) => {
                    return new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: 'GBP',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(amt);
                },
                'CNY': (amt) => {
                    return new Intl.NumberFormat('zh-CN', {
                        style: 'currency',
                        currency: 'CNY',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(amt);
                },
                'KRW': (amt) => {
                    return new Intl.NumberFormat('ko-KR', {
                        style: 'currency',
                        currency: 'KRW',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(amt);
                },
                'THB': (amt) => {
                    return new Intl.NumberFormat('th-TH', {
                        style: 'currency',
                        currency: 'THB',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(amt);
                },
                'SGD': (amt) => {
                    return new Intl.NumberFormat('en-SG', {
                        style: 'currency',
                        currency: 'SGD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(amt);
                },
                'MYR': (amt) => {
                    return new Intl.NumberFormat('ms-MY', {
                        style: 'currency',
                        currency: 'MYR',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(amt);
                }
            };

            // Use formatter if available, otherwise fallback to VND
            const formatter = formatters[currency] || formatters['VND'];
            return formatter(numericAmount);

        } catch (error) {
            console.error('Currency formatting error:', error);
            // Fallback to simple formatting
            return `${getCurrencySymbol(currency)} ${numericAmount.toLocaleString()}`;
        }
    };

    /**
     * Get currency symbol for a given currency code
     * @param {string} currencyCode - Currency code (e.g., 'VND', 'USD')
     * @returns {string} Currency symbol
     */
    const getCurrencySymbol = (currencyCode = null) => {
        const currency = currencyCode || getCurrency();

        const symbols = {
            'VND': '₫',
            'USD': '$',
            'EUR': '€',
            'JPY': '¥',
            'GBP': '£',
            'CNY': '¥',
            'KRW': '₩',
            'THB': '฿',
            'SGD': 'S$',
            'MYR': 'RM'
        };

        return symbols[currency] || '₫';
    };

    /**
     * Format a number without currency symbol (just thousands separators)
     * @param {number|string} amount - The amount to format
     * @returns {string} Formatted number string
     */
    const formatNumber = (amount) => {
        const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

        if (isNaN(numericAmount)) {
            return '0';
        }

        return numericAmount.toLocaleString('vi-VN');
    };

    /**
     * Format amount with currency symbol but no locale-specific formatting
     * Useful for input fields
     * @param {number|string} amount - The amount to format
     * @param {string} currencyCode - Optional currency override
     * @returns {string} Formatted string like "$ 1,234.56"
     */
    const formatCurrencySimple = (amount, currencyCode = null) => {
        const currency = currencyCode || getCurrency();
        const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

        if (isNaN(numericAmount)) {
            return `${getCurrencySymbol(currency)} 0`;
        }

        return `${getCurrencySymbol(currency)} ${formatNumber(numericAmount)}`;
    };

    /**
     * Parse a formatted currency string to a number
     * @param {string} formattedAmount - Formatted currency string
     * @returns {number} Numeric amount
     */
    const parseCurrency = (formattedAmount) => {
        if (typeof formattedAmount === 'number') {
            return formattedAmount;
        }

        if (!formattedAmount || typeof formattedAmount !== 'string') {
            return 0;
        }

        // Remove all non-numeric characters except decimal point and minus sign
        const cleaned = formattedAmount.replace(/[^\d.-]/g, '');
        const parsed = parseFloat(cleaned);

        return isNaN(parsed) ? 0 : parsed;
    };

    return {
        formatCurrency,
        getCurrencySymbol,
        formatNumber,
        formatCurrencySimple,
        parseCurrency
    };
};

/**
 * Standalone currency formatter (without hook)
 * Use this in non-React contexts or when you have the currency code directly
 */
export const formatCurrencyStandalone = (amount, currencyCode = 'VND') => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
        return '0 ₫';
    }

    const formatters = {
        'VND': (amt) => new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amt),
        'USD': (amt) => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amt),
        'EUR': (amt) => new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(amt)
    };

    const formatter = formatters[currencyCode] || formatters['VND'];
    return formatter(numericAmount);
};

/**
 * Get currency symbol (standalone version)
 */
export const getCurrencySymbolStandalone = (currencyCode = 'VND') => {
    const symbols = {
        'VND': '₫',
        'USD': '$',
        'EUR': '€',
        'JPY': '¥',
        'GBP': '£',
        'CNY': '¥',
        'KRW': '₩',
        'THB': '฿',
        'SGD': 'S$',
        'MYR': 'RM'
    };

    return symbols[currencyCode] || '₫';
};
