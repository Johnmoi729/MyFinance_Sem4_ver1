import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import SearchFilter from '../../components/common/SearchFilter';

const AuditLogs = () => {
 const [auditLogs, setAuditLogs] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [currentPage, setCurrentPage] = useState(0);
 const [totalPages, setTotalPages] = useState(0);
 const [totalElements, setTotalElements] = useState(0);
 const [showCleanupModal, setShowCleanupModal] = useState(false);
 const [daysOld, setDaysOld] = useState(90);

 // Filters
 const [filters, setFilters] = useState({
 action: '',
 entityType: '',
 startDate: '',
 endDate: ''
 });

 // Only show important admin actions (state-changing operations)
 const actionTypes = [
 'USER_ACTIVATE',
 'USER_DEACTIVATE',
 'CONFIG_CREATE',
 'CONFIG_UPDATE',
 'CONFIG_DELETE',
 'MAINTENANCE_MODE_ENABLE',
 'MAINTENANCE_MODE_DISABLE',
 'AUDIT_LOG_CLEANUP',
 'AUDIT_LOG_EXPORT',
 'SYSTEM_CONFIG_ENUM_MIGRATION' // Only actual migration, not checks
 ];

 const fetchAuditLogs = useCallback(async () => {
 try {
 setLoading(true);
 setError(null);

 const params = {
 page: currentPage,
 size: 20,
 sortBy: 'timestamp',
 sortDir: 'desc'
 };

 // Add filters to params
 Object.keys(filters).forEach(key => {
 if (filters[key]) {
 // Convert date to datetime format for backend (ISO 8601)
 if (key === 'startDate' && filters[key]) {
 params[key] = filters[key] + 'T00:00:00';
 } else if (key === 'endDate' && filters[key]) {
 params[key] = filters[key] + 'T23:59:59';
 } else {
 params[key] = filters[key];
 }
 }
 });

 const response = await adminAPI.getAuditLogs(params);

 if (response && response.success) {
 setAuditLogs(response.data.content || []);
 setTotalPages(response.data.totalPages || 0);
 setTotalElements(response.data.totalElements || 0);
 } else {
 setError(response?.message || 'Failed to load audit logs');
 }
 } catch (err) {
 console.error('Audit logs fetch error:', err);
 setError('Error loading audit logs');
 } finally {
 setLoading(false);
 }
 }, [currentPage, filters]);

 useEffect(() => {
 fetchAuditLogs();
 }, [fetchAuditLogs]);

 const handleFilterChange = (key, value) => {
 setFilters(prev => ({
 ...prev,
 [key]: value
 }));
 setCurrentPage(0);
 };

 const clearFilters = () => {
 setFilters({
 action: '',
 entityType: '',
 startDate: '',
 endDate: ''
 });
 setCurrentPage(0);
 };

 const formatTimestamp = (timestamp) => {
 return new Date(timestamp).toLocaleString('vi-VN', {
 year: 'numeric',
 month: '2-digit',
 day: '2-digit',
 hour: '2-digit',
 minute: '2-digit'
 });
 };

 const getActionBadgeColor = (action) => {
 if (action?.includes('CREATE')) return 'bg-green-100 text-green-800';
 if (action?.includes('UPDATE')) return 'bg-indigo-100 text-indigo-800';
 if (action?.includes('DELETE') || action?.includes('CLEANUP')) return 'bg-red-100 text-red-800';
 if (action?.includes('ACTIVATE')) return 'bg-green-100 text-green-800';
 if (action?.includes('DEACTIVATE')) return 'bg-orange-100 text-orange-800';
 if (action?.includes('ENABLE')) return 'bg-green-100 text-green-800';
 if (action?.includes('DISABLE')) return 'bg-orange-100 text-orange-800';
 if (action?.includes('EXPORT')) return 'bg-purple-100 text-purple-800';
 return 'bg-gray-100 text-gray-800';
 };

 const crystallizeLogMessage = (log) => {
 // Parse details to extract meaningful information
 let details = {};
 try {
 details = JSON.parse(log.details || '{}');
 } catch (e) {
 details = { description: log.details };
 }

 const description = details.description || '';
 const username = details.username || 'System';

 // Crystallize the message based on action type
 switch (log.action) {
 case 'USER_ACTIVATE':
 return `${username} đã kích hoạt tài khoản người dùng`;
 case 'USER_DEACTIVATE':
 return `${username} đã vô hiệu hóa tài khoản người dùng`;
 case 'CONFIG_CREATE':
 return `${username} đã tạo cấu hình hệ thống mới`;
 case 'CONFIG_UPDATE':
 return `${username} đã cập nhật cấu hình hệ thống`;
 case 'CONFIG_DELETE':
 return `${username} đã xóa cấu hình hệ thống`;
 case 'MAINTENANCE_MODE_ENABLE':
 return `${username} đã bật chế độ bảo trì`;
 case 'MAINTENANCE_MODE_DISABLE':
 return `${username} đã tắt chế độ bảo trì`;
 case 'AUDIT_LOG_CLEANUP':
 return `${username} đã xóa nhật ký audit cũ`;
 case 'AUDIT_LOG_EXPORT':
 return `${username} đã xuất nhật ký audit`;
 case 'SYSTEM_CONFIG_ENUM_MIGRATION':
 return `${username} đã thực hiện migration cấu hình hệ thống`;
 default:
 return description || log.action;
 }
 };

 const exportAuditLogs = async () => {
 try {
 setLoading(true);
 const params = {
 startDate: filters.startDate ? filters.startDate + 'T00:00:00' : undefined,
 endDate: filters.endDate ? filters.endDate + 'T23:59:59' : undefined,
 format: 'JSON'
 };

 const response = await adminAPI.exportAuditLogs(params);

 if (response && response.success) {
 // Create a downloadable JSON file
 const dataStr = JSON.stringify(response.data, null, 2);
 const dataBlob = new Blob([dataStr], { type: 'application/json' });
 const url = URL.createObjectURL(dataBlob);
 const link = document.createElement('a');
 link.href = url;
 link.download = `audit_logs_backup_${new Date().toISOString().split('T')[0]}.json`;
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 URL.revokeObjectURL(url);

 alert('Đã xuất và tải xuống nhật ký audit thành công!');
 } else {
 alert(response?.message || 'Không thể xuất nhật ký audit');
 }
 } catch (err) {
 console.error('Export error:', err);
 alert('Lỗi khi xuất nhật ký audit');
 } finally {
 setLoading(false);
 }
 };

 const handleCleanupLogs = async () => {
 if (!window.confirm(`Bạn có chắc chắn muốn xóa các nhật ký audit cũ hơn ${daysOld} ngày không? Hành động này không thể hoàn tác.`)) {
 return;
 }

 try {
 setLoading(true);
 const response = await adminAPI.cleanupAuditLogs({ daysOld });

 if (response && response.success) {
 alert(`Đã xóa ${response.data.deletedCount} nhật ký audit cũ`);
 setShowCleanupModal(false);
 fetchAuditLogs(); // Refresh the list
 } else {
 alert(response?.message || 'Không thể xóa nhật ký audit');
 }
 } catch (err) {
 console.error('Cleanup error:', err);
 alert('Lỗi khi xóa nhật ký audit');
 } finally {
 setLoading(false);
 }
 };

 if (loading && auditLogs.length === 0) {
 return (
 <AdminLayout>
 <div className="flex items-center justify-center h-64">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
 </div>
 </AdminLayout>
 );
 }

 return (
 <AdminLayout>
 <div className="space-y-6">
 {/* Header */}
 <div className="flex justify-between items-center">
 <div>
 <h1 className="text-2xl font-bold text-gray-900">Nhật Ký Quản Trị</h1>
 <p className="text-gray-600">
 Theo dõi các hành động quản trị quan trọng ({totalElements} hành động)
 </p>
 </div>
 <div className="flex space-x-2">
 <button
 onClick={exportAuditLogs}
 disabled={loading}
 className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
 >
 Sao Lưu & Tải Xuống
 </button>
 <button
 onClick={() => setShowCleanupModal(true)}
 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
 >
 Xóa Nhật Ký Cũ
 </button>
 </div>
 </div>

 {/* Info Box */}
 <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
 <p className="text-sm text-indigo-800">
 <strong>Lưu ý:</strong> Hệ thống chỉ ghi lại các hành động quản trị quan trọng như kích hoạt/vô hiệu hóa người dùng,
 thay đổi cấu hình hệ thống. Các hành động xem thông tin thông thường không được ghi lại để bảo vệ quyền riêng tư
 và giảm thiểu dữ liệu không cần thiết.
 </p>
 </div>

 {/* Filters */}
 <SearchFilter
 useDropdown={true}
 filterOptions={[
 { value: '', label: 'Tất cả hành động' },
 ...actionTypes.map(action => ({ value: action, label: action }))
 ]}
 activeFilter={filters.action}
 onFilterChange={(value) => handleFilterChange('action', value)}
 showDateFilter={true}
 dateRange={{ startDate: filters.startDate, endDate: filters.endDate }}
 onDateChange={(dateRange) => {
 if (dateRange.startDate !== filters.startDate) {
 handleFilterChange('startDate', dateRange.startDate);
 }
 if (dateRange.endDate !== filters.endDate) {
 handleFilterChange('endDate', dateRange.endDate);
 }
 }}
 customFilters={[
 <button
 key="clear"
 onClick={clearFilters}
 className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors"
 >
 Xóa bộ lọc
 </button>
 ]}
 />

 {error && (
 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
 <strong className="font-bold">Lỗi: </strong>
 <span>{error}</span>
 </div>
 )}

 {/* Audit Logs List - Crystallized View */}
 <div className="bg-white rounded-lg shadow overflow-hidden">
 <div className="divide-y divide-gray-200">
 {auditLogs.map((log) => (
 <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
 <div className="flex items-start justify-between">
 <div className="flex-1">
 <div className="flex items-center space-x-3 mb-2">
 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}>
 {log.action}
 </span>
 <span className="text-sm text-gray-500">
 {formatTimestamp(log.timestamp)}
 </span>
 </div>
 <p className="text-gray-900 font-medium">
 {crystallizeLogMessage(log)}
 </p>
 {log.oldValue && log.newValue && (
 <div className="mt-2 text-sm text-gray-600">
 <span className="text-red-600 line-through">{log.oldValue}</span>
 {' → '}
 <span className="text-green-600 font-medium">{log.newValue}</span>
 </div>
 )}
 </div>
 <div className="text-right text-sm text-gray-500">
 {log.ipAddress && (
 <div>IP: {log.ipAddress}</div>
 )}
 </div>
 </div>
 </div>
 ))}
 </div>

 {auditLogs.length === 0 && !loading && (
 <div className="text-center py-8">
 <p className="text-gray-500">Không có nhật ký nào</p>
 </div>
 )}
 </div>

 {/* Pagination */}
 {totalPages > 1 && (
 <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-lg shadow">
 <div className="flex justify-between flex-1 sm:hidden">
 <button
 onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
 disabled={currentPage === 0}
 className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
 >
 Trước
 </button>
 <button
 onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
 disabled={currentPage >= totalPages - 1}
 className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
 >
 Sau
 </button>
 </div>
 <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
 <div>
 <p className="text-sm text-gray-700">
 Trang <span className="font-medium">{currentPage + 1}</span> / {' '}
 <span className="font-medium">{totalPages}</span>
 {' '}({totalElements} hành động)
 </p>
 </div>
 <div>
 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
 <button
 onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
 disabled={currentPage === 0}
 className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
 >
 Trước
 </button>

 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
 const pageNumber = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
 return (
 <button
 key={pageNumber}
 onClick={() => setCurrentPage(pageNumber)}
 className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
 currentPage === pageNumber
 ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
 : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
 }`}
 >
 {pageNumber + 1}
 </button>
 );
 })}

 <button
 onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
 disabled={currentPage >= totalPages - 1}
 className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
 >
 Sau
 </button>
 </nav>
 </div>
 </div>
 </div>
 )}

 {/* Cleanup Modal */}
 {showCleanupModal && (
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
 <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
 <h3 className="text-lg font-bold text-gray-900 mb-4">Xóa Nhật Ký Audit Cũ</h3>
 <p className="text-gray-600 mb-4">
 Nhập số ngày để xóa các nhật ký cũ hơn thời gian đó.
 Hành động này không thể hoàn tác.
 </p>
 <div className="mb-4">
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Xóa nhật ký cũ hơn (ngày)
 </label>
 <input
 type="number"
 min="1"
 value={daysOld}
 onChange={(e) => setDaysOld(parseInt(e.target.value))}
 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
 />
 </div>
 <div className="flex space-x-3">
 <button
 onClick={handleCleanupLogs}
 disabled={loading}
 className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
 >
 Xác Nhận Xóa
 </button>
 <button
 onClick={() => setShowCleanupModal(false)}
 className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
 >
 Hủy
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 </AdminLayout>
 );
};

export default AuditLogs;
