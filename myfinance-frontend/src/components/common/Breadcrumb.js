import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, BarChart3 } from '../icons';

const Breadcrumb = ({ source, sourceName, onBack }) => {
 const navigate = useNavigate();

 if (!source) return null;

 const handleBackClick = () => {
 if (onBack) {
 onBack();
 } else {
 // Default back navigation
 if (source === 'analytics') {
 navigate('/analytics');
 }
 }
 };

 return (
 <div className="mb-4 flex items-center gap-2 text-sm">
 <button
 onClick={handleBackClick}
 className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
 >
 <BarChart3 className="w-4 h-4" />
 <span>Quay lại Phân tích</span>
 </button>

 {sourceName && (
 <>
 <ChevronRight className="w-4 h-4 text-gray-400" />
 <span className="text-gray-700 font-medium">{sourceName}</span>
 </>
 )}
 </div>
 );
};

export default Breadcrumb;
