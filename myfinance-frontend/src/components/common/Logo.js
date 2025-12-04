import React from 'react';
import { Link } from 'react-router-dom';

/**
 * MyFinance Logo Component
 *
 * Centralized logo component with multiple size options and text visibility control.
 * Features a gradient background matching the app's indigo/violet theme.
 *
 * @param {string} size - Size variant: 'small', 'normal', 'large'
 * @param {boolean} showText - Whether to display "MyFinance" text
 * @param {boolean} linkEnabled - Whether logo is clickable (default: true)
 * @param {string} className - Additional CSS classes
 */
export const Logo = ({
    size = "normal",
    showText = true,
    linkEnabled = true,
    className = ""
}) => {
    const sizeClasses = {
        small: "w-8 h-8",
        normal: "w-10 h-10",
        large: "w-16 h-16"
    };

    const textSizeClasses = {
        small: "text-lg",
        normal: "text-xl",
        large: "text-3xl"
    };

    const logoContent = (
        <>
            <div className={`${sizeClasses[size]} bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all`}>
                <span className={`text-white font-bold ${textSizeClasses[size]}`}>
                    M
                </span>
            </div>
            {showText && (
                <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent`}>
                    MyFinance
                </span>
            )}
        </>
    );

    if (!linkEnabled) {
        return (
            <div className={`flex items-center space-x-3 ${className}`}>
                {logoContent}
            </div>
        );
    }

    return (
        <Link
            to="/dashboard"
            className={`flex items-center space-x-3 group ${className}`}
        >
            {logoContent}
        </Link>
    );
};

export default Logo;
