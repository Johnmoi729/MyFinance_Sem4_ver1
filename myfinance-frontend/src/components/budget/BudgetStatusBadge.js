import React from 'react';

const BudgetStatusBadge = ({ status, usagePercentage, size = 'medium' }) => {
 const getStatusConfig = (status) => {
 switch (status) {
 case 'GREEN':
 return {
 bg: 'bg-green-100',
 text: 'text-green-800',
 border: 'border-green-200',
 label: 'Trong giới hạn'
 };
 case 'YELLOW':
 return {
 bg: 'bg-yellow-100',
 text: 'text-yellow-800',
 border: 'border-yellow-200',
 label: 'Cảnh báo'
 };
 case 'RED':
 return {
 bg: 'bg-red-100',
 text: 'text-red-800',
 border: 'border-red-200',
 label: 'Vượt ngân sách'
 };
 default:
 return {
 bg: 'bg-gray-100',
 text: 'text-gray-800',
 border: 'border-gray-200',
 label: 'Không xác định'
 };
 }
 };

 const getSizeClasses = () => {
 switch (size) {
 case 'small':
 return 'px-2 py-1 text-xs';
 case 'large':
 return 'px-4 py-2 text-base';
 default:
 return 'px-3 py-1 text-sm';
 }
 };

 const config = getStatusConfig(status);
 const isOverBudget = usagePercentage > 100;

 return (
 <div className="inline-flex items-center space-x-2">
 <span
 className={`
 inline-flex items-center
 ${getSizeClasses()}
 font-medium rounded-full border
 ${config.bg} ${config.text} ${config.border}
 `}
 >
 {config.label}
 {isOverBudget && (
 <span className="ml-1 text-red-500 font-bold">⚠</span>
 )}
 </span>

 {/* Percentage display */}
 <span className={`
 ${size === 'small' ? 'text-xs' : size === 'large' ? 'text-base' : 'text-sm'}
 font-semibold
 ${config.text}
 `}>
 {usagePercentage.toFixed(1)}%
 </span>
 </div>
 );
};

export default BudgetStatusBadge;