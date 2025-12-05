/**
 * Vietnamese Dong (VND) currency formatter
 * Simplified version - VND only
 */

/**
 * Currency formatter hook for Vietnamese Dong
 * Returns functions to format amounts in VND
 */
export const useCurrencyFormatter = () => {
    /**
     * Format an amount in Vietnamese Dong
     * @param {number|string} amount - The amount to format
     * @returns {string} Formatted currency string
     */
    const formatCurrency = (amount) => {
        const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

        // Handle invalid amounts
        if (isNaN(numericAmount)) {
            return '0 ₫';
        }

        try {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(numericAmount);
        } catch (error) {
            console.error('Currency formatting error:', error);
            // Fallback to simple formatting
            return `₫ ${numericAmount.toLocaleString('vi-VN')}`;
        }
    };

    /**
     * Get Vietnamese Dong currency symbol
     * @returns {string} Currency symbol '₫'
     */
    const getCurrencySymbol = () => {
        return '₫';
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
     * @returns {string} Formatted string like "₫ 1,234"
     */
    const formatCurrencySimple = (amount) => {
        const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

        if (isNaN(numericAmount)) {
            return '₫ 0';
        }

        return `₫ ${formatNumber(numericAmount)}`;
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
 * Use this in non-React contexts
 */
export const formatCurrencyStandalone = (amount) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
        return '0 ₫';
    }

    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numericAmount);
};

/**
 * Get currency symbol (standalone version)
 */
export const getCurrencySymbolStandalone = () => {
    return '₫';
};
