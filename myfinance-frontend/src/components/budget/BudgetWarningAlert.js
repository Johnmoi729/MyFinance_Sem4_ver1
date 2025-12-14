import React from 'react';
import { useCurrencyFormatter } from '../../utils/currencyFormatter';

const BudgetWarningAlert = ({ alerts, onViewDetails, onDismiss, compact = false }) => {
 const { formatCurrency } = useCurrencyFormatter();

 if (!alerts || alerts.length === 0) {
 return null;
 }

 const getAlertIcon = (alertLevel) => {
 switch (alertLevel) {
 case 'RED':
 return '🚨';
 case 'YELLOW':
 return '⚠️';
 default:
 return '⚠️';
 }
 };

 const getAlertStyle = (alertLevel) => {
 switch (alertLevel) {
 case 'RED':
 return 'bg-red-50 border-red-200 text-red-800';
 case 'YELLOW':
 return 'bg-yellow-50 border-yellow-200 text-yellow-800';
 default:
 return 'bg-gray-50 border-gray-200 text-gray-800';
 }
 };

 // Group alerts by severity
 const redAlerts = alerts.filter(alert => alert.alertLevel === 'RED');
 const yellowAlerts = alerts.filter(alert => alert.alertLevel === 'YELLOW');

 if (compact) {
 return (
 <div className="space-y-2">
 {redAlerts.length > 0 && (
 <div className="bg-red-50 border border-red-200 rounded-md p-3">
 <div className="flex items-center">
 <span className="text-lg mr-2">🚨</span>
 <div className="flex-1">
 <p className="text-sm font-medium text-red-800">
 {redAlerts.length} ngân sách đã vượt giới hạn
 </p>
 <p className="text-xs text-red-600 mt-1">
 {redAlerts.slice(0, 2).map(alert => alert.categoryName).join(', ')}
 {redAlerts.length > 2 && ` và ${redAlerts.length - 2} khác`}
 </p>
 </div>
 {onViewDetails && (
 <button
 onClick={onViewDetails}
 className="text-xs text-red-600 hover:text-red-800 font-medium ml-2"
 >
 Xem chi tiết
 </button>
 )}
 </div>
 </div>
 )}

 {yellowAlerts.length > 0 && (
 <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
 <div className="flex items-center">
 <span className="text-lg mr-2">⚠️</span>
 <div className="flex-1">
 <p className="text-sm font-medium text-yellow-800">
 {yellowAlerts.length} ngân sách cần chú ý
 </p>
 <p className="text-xs text-yellow-600 mt-1">
 {yellowAlerts.slice(0, 2).map(alert => alert.categoryName).join(', ')}
 {yellowAlerts.length > 2 && ` và ${yellowAlerts.length - 2} khác`}
 </p>
 </div>
 {onViewDetails && (
 <button
 onClick={onViewDetails}
 className="text-xs text-yellow-600 hover:text-yellow-800 font-medium ml-2"
 >
 Xem chi tiết
 </button>
 )}
 </div>
 </div>
 )}
 </div>
 );
 }

 return (
 <div className="space-y-4">
 {alerts.map((alert, index) => (
 <div
 key={index}
 className={`border rounded-lg p-4 ${getAlertStyle(alert.alertLevel)}`}
 >
 <div className="flex items-start">
 <span className="text-xl mr-3 mt-0.5">
 {getAlertIcon(alert.alertLevel)}
 </span>

 <div className="flex-1">
 <div className="flex items-center justify-between mb-2">
 <h4 className="text-base font-semibold">
 {alert.categoryName}
 </h4>
 <span className="text-sm font-bold">
 {alert.usagePercentage.toFixed(1)}%
 </span>
 </div>

 <p className="text-sm mb-3">
 {alert.message}
 </p>

 <div className="grid grid-cols-2 gap-4 text-sm">
 <div>
 <span className="text-gray-600">Ngân sách:</span>
 <div className="font-semibold">
 {formatCurrency(alert.budgetAmount)}
 </div>
 </div>
 <div>
 <span className="text-gray-600">Đã chi:</span>
 <div className="font-semibold">
 {formatCurrency(alert.actualSpent)}
 </div>
 </div>
 </div>

 <div className="flex items-center justify-between mt-4">
 <span className="text-xs text-gray-500">
 Tháng {alert.budgetMonth}/{alert.budgetYear}
 </span>

 <div className="flex space-x-2">
 {onViewDetails && (
 <button
 onClick={() => onViewDetails(alert)}
 className="text-xs px-3 py-1 rounded bg-white border hover:bg-gray-50"
 >
 Chi tiết
 </button>
 )}
 {onDismiss && (
 <button
 onClick={() => onDismiss(alert)}
 className="text-xs px-3 py-1 rounded bg-white border hover:bg-gray-50"
 >
 Đã hiểu
 </button>
 )}
 </div>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 );
};

export default BudgetWarningAlert;