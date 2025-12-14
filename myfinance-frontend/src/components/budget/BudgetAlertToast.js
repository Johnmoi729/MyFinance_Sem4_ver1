import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from '../icons';

const BudgetAlertToast = ({ alerts, onClose }) => {
 const [visible, setVisible] = useState(true);
 const [isExiting, setIsExiting] = useState(false);

 useEffect(() => {
 // Auto-dismiss after 8 seconds
 const timer = setTimeout(() => {
 handleClose();
 }, 8000);

 return () => clearTimeout(timer);
 }, []);

 const handleClose = () => {
 setIsExiting(true);
 setTimeout(() => {
 setVisible(false);
 if (onClose) onClose();
 }, 300); // Match animation duration
 };

 if (!visible || !alerts || alerts.length === 0) return null;

 // Get the most critical alert
 const criticalAlert = alerts.find(a => a.alertLevel === 'CRITICAL') || alerts[0];
 const alertCount = alerts.length;

 const getAlertStyles = () => {
 switch (criticalAlert.alertLevel) {
 case 'CRITICAL':
 return {
 bg: 'bg-gradient-to-r from-red-50 to-rose-50',
 border: 'border-red-300',
 text: 'text-red-800',
 icon: 'text-red-600',
 progressBg: 'bg-red-200',
 progressBar: 'bg-red-600'
 };
 case 'WARNING':
 return {
 bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
 border: 'border-yellow-300',
 text: 'text-yellow-800',
 icon: 'text-yellow-600',
 progressBg: 'bg-yellow-200',
 progressBar: 'bg-yellow-600'
 };
 default:
 return {
 bg: 'bg-gradient-to-r from-orange-50 to-orange-50',
 border: 'border-orange-300',
 text: 'text-orange-800',
 icon: 'text-orange-600',
 progressBg: 'bg-orange-200',
 progressBar: 'bg-orange-600'
 };
 }
 };

 const styles = getAlertStyles();

 return (
 <div
 className={`
 fixed top-20 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]
 ${styles.bg} ${styles.border} border-2 rounded-lg shadow-2xl
 transition-all duration-300 ease-out
 ${isExiting ? 'translate-x-[120%] opacity-0' : 'translate-x-0 opacity-100'}
 `}
 style={{
 animation: isExiting ? 'none' : 'slideInRight 0.3s ease-out'
 }}
 >
 {/* Header */}
 <div className="flex items-start justify-between p-4 pb-3">
 <div className="flex items-center space-x-3">
 <div className={`flex-shrink-0 ${styles.icon}`}>
 <AlertTriangle className="w-6 h-6" />
 </div>
 <div className="flex-1 min-w-0">
 <h3 className={`font-bold ${styles.text} text-sm`}>
 Cảnh báo ngân sách
 {alertCount > 1 && ` (${alertCount})`}
 </h3>
 <p className={`text-xs ${styles.text} mt-0.5 opacity-80`}>
 {criticalAlert.categoryName}
 </p>
 </div>
 </div>
 <button
 onClick={handleClose}
 className={`flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity ml-2`}
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Content */}
 <div className="px-4 pb-3">
 <p className={`text-sm ${styles.text} font-medium`}>
 {criticalAlert.message}
 </p>
 <div className="mt-2 flex items-center justify-between text-xs">
 <span className={`${styles.text} opacity-70`}>
 Đã sử dụng: {(criticalAlert.usagePercentage || 0).toFixed(1)}%
 </span>
 <span className={`${styles.text} font-semibold`}>
 {(criticalAlert.usagePercentage || 0) > 100 ? 'Vượt ngân sách' : 'Gần đạt giới hạn'}
 </span>
 </div>
 </div>

 {/* Progress bar showing usage percentage */}
 <div className="px-4 pb-4">
 <div className={`w-full h-2 ${styles.progressBg} rounded-full overflow-hidden`}>
 <div
 className={`h-full ${styles.progressBar} transition-all duration-500 rounded-full`}
 style={{ width: `${Math.min(criticalAlert.usagePercentage || 0, 100)}%` }}
 />
 </div>
 </div>

 {/* Additional alerts indicator */}
 {alertCount > 1 && (
 <div className={`px-4 pb-3 border-t ${styles.border}`}>
 <p className={`text-xs ${styles.text} opacity-70 pt-2`}>
 + {alertCount - 1} danh mục khác cũng đang ở mức cảnh báo
 </p>
 </div>
 )}
 </div>
 );
};

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
 @keyframes slideInRight {
 from {
 transform: translateX(120%);
 opacity: 0;
 }
 to {
 transform: translateX(0);
 opacity: 1;
 }
 }
`;
document.head.appendChild(style);

export default BudgetAlertToast;
