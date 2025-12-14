import React from 'react';
import { useCurrencyFormatter } from '../../utils/currencyFormatter';

const BudgetProgressBar = ({
 budgetAmount,
 actualSpent,
 usagePercentage,
 status,
 showDetails = true,
 size = 'medium' // small, medium, large
}) => {
 const { formatCurrency } = useCurrencyFormatter();

 const getStatusColor = (status) => {
 switch (status) {
 case 'GREEN':
 return 'bg-gradient-to-r from-green-500 to-emerald-500';
 case 'YELLOW':
 return 'bg-gradient-to-r from-yellow-500 to-amber-500';
 case 'RED':
 return 'bg-gradient-to-r from-red-500 to-rose-600';
 default:
 return 'bg-gradient-to-r from-gray-400 to-gray-500';
 }
 };

 const getGlowEffect = (status) => {
 switch (status) {
 case 'GREEN':
 return 'shadow-sm shadow-green-200';
 case 'YELLOW':
 return 'shadow-md shadow-yellow-200';
 case 'RED':
 return 'shadow-lg shadow-red-300 animate-pulse';
 default:
 return '';
 }
 };

 const getProgressBarHeight = () => {
 switch (size) {
 case 'small':
 return 'h-2';
 case 'large':
 return 'h-6';
 default:
 return 'h-4';
 }
 };

 const getTextSize = () => {
 switch (size) {
 case 'small':
 return 'text-xs';
 case 'large':
 return 'text-base';
 default:
 return 'text-sm';
 }
 };

 // Cap the visual progress at 100% even if over budget
 const visualProgress = Math.min(usagePercentage, 100);
 const isOverBudget = usagePercentage > 100;

 return (
 <div className="space-y-2">
 {/* Progress Bar */}
 <div className="relative">
 <div className={`w-full ${getProgressBarHeight()} bg-gray-200 rounded-full overflow-hidden ${getGlowEffect(status)}`}>
 <div
 className={`${getProgressBarHeight()} ${getStatusColor(status)} transition-all duration-500 ease-out rounded-full`}
 style={{ width: `${visualProgress}%` }}
 />
 </div>

 {/* Over budget indicator */}
 {isOverBudget && (
 <div className="absolute right-0 top-0 transform translate-x-2">
 <div className="bg-red-500 text-white text-xs px-1 py-0.5 rounded shadow-lg">
 <span className="text-xs font-bold">!</span>
 </div>
 </div>
 )}
 </div>

 {/* Details */}
 {showDetails && (
 <div className={`flex justify-between items-center ${getTextSize()}`}>
 <div className="flex items-center space-x-4">
 <span className="text-gray-600">
 Đã chi: <span className="font-semibold text-gray-900">
 {formatCurrency(actualSpent)}
 </span>
 </span>
 <span className="text-gray-400">•</span>
 <span className="text-gray-600">
 Ngân sách: <span className="font-semibold text-gray-900">
 {formatCurrency(budgetAmount)}
 </span>
 </span>
 </div>

 <div className={`font-bold ${
 status === 'RED' ? 'text-red-600' :
 status === 'YELLOW' ? 'text-yellow-600' :
 'text-green-600'
 }`}>
 {usagePercentage.toFixed(1)}%
 {isOverBudget && <span className="ml-1 text-red-500">⚠</span>}
 </div>
 </div>
 )}

 {/* Compact percentage only */}
 {!showDetails && (
 <div className="text-center">
 <span className={`${getTextSize()} font-bold ${
 status === 'RED' ? 'text-red-600' :
 status === 'YELLOW' ? 'text-yellow-600' :
 'text-green-600'
 }`}>
 {usagePercentage.toFixed(1)}%
 {isOverBudget && <span className="ml-1 text-red-500">⚠</span>}
 </span>
 </div>
 )}
 </div>
 );
};

export default BudgetProgressBar;