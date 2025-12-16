import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { CheckCircle, Settings, Shield, Info } from '../../components/icons';

const SystemConfig = () => {
 const [configs, setConfigs] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [currentPage, setCurrentPage] = useState(0);
 const [totalPages, setTotalPages] = useState(0);
 const [maintenanceMode, setMaintenanceMode] = useState(false);
 const [migrationNeeded, setMigrationNeeded] = useState(false);
 const [migrationLoading, setMigrationLoading] = useState(false);

 // Filters
 const [filters, setFilters] = useState({
 type: '',
 isPublic: ''
 });

 // REMOVED: editingConfig, newConfig, formData states - edit functionality removed

 const configTypes = [
 'APPLICATION', 'SECURITY', 'FEATURE', 'UI', 'DATABASE',
 'INTEGRATION', 'NOTIFICATION', 'PERFORMANCE', 'LOGGING', 'MAINTENANCE'
 ];

 const fetchConfigs = useCallback(async () => {
 try {
 setLoading(true);
 setError(null);

 const params = {
 page: currentPage,
 size: 20,
 sortBy: 'configKey',
 sortDir: 'asc'
 };

 Object.keys(filters).forEach(key => {
 if (filters[key] !== '') {
 params[key] = filters[key];
 }
 });

 const response = await adminAPI.getConfigs(params);

 if (response && response.success) {
 setConfigs(response.data.content || []);
 setTotalPages(response.data.totalPages || 0);
 } else {
 setError(response?.message || 'Failed to load configurations');
 }
 } catch (err) {
 console.error('Config fetch error:', err);
 setError('Error loading configurations');
 } finally {
 setLoading(false);
 }
 }, [currentPage, filters]);

 useEffect(() => {
 fetchConfigs();
 fetchMaintenanceMode();
 checkMigrationStatus();
 }, [fetchConfigs]);

 const fetchMaintenanceMode = async () => {
 try {
 const response = await adminAPI.getMaintenanceMode();
 if (response && response.success) {
 setMaintenanceMode(response.data);
 }
 } catch (err) {
 console.error('Maintenance mode fetch error:', err);
 }
 };

 const handleFilterChange = (key, value) => {
 setFilters(prev => ({
 ...prev,
 [key]: value
 }));
 setCurrentPage(0);
 };

 // REMOVED: Edit functionality (openEditModal, closeModal, handleSubmit, handleFormChange)
 // All config editing is now done in code to prevent production-breaking changes

 // REMOVED: handleDelete function - configs cannot be deleted (code-first pattern)

 const toggleMaintenanceMode = async () => {
 try {
 const response = await adminAPI.setMaintenanceMode(!maintenanceMode);
 if (response && response.success) {
 setMaintenanceMode(!maintenanceMode);
 alert(response.message || 'Đã thay đổi chế độ bảo trì thành công');
 } else {
 alert(response?.message || 'Không thể thay đổi chế độ bảo trì');
 }
 } catch (err) {
 console.error('Toggle maintenance mode error:', err);
 alert('Lỗi khi thay đổi chế độ bảo trì');
 }
 };

 const checkMigrationStatus = async () => {
 try {
 const response = await adminAPI.checkSystemConfigEnumMigration();
 if (response && response.success) {
 setMigrationNeeded(response.data);
 }
 } catch (err) {
 console.error('Migration check error:', err);
 }
 };

 const runMigration = async () => {
 if (!window.confirm('Are you sure you want to run the enum migration? This will update existing configuration types.')) {
 return;
 }

 try {
 setMigrationLoading(true);
 const response = await adminAPI.migrateSystemConfigEnum();

 if (response && response.success) {
 alert('Migration completed successfully!');
 setMigrationNeeded(false);
 fetchConfigs(); // Refresh the configs
 } else {
 alert('Migration failed: ' + (response?.message || 'Unknown error'));
 }
 } catch (err) {
 console.error('Migration error:', err);
 alert('Migration failed');
 } finally {
 setMigrationLoading(false);
 }
 };

 const getTypeColor = (type) => {
 const colors = {
 SETTING: 'bg-indigo-100 text-indigo-800',
 FEATURE_FLAG: 'bg-green-100 text-green-800',
 INTEGRATION: 'bg-purple-100 text-purple-800',
 SECURITY: 'bg-red-100 text-red-800',
 PERFORMANCE: 'bg-yellow-100 text-yellow-800'
 };
 return colors[type] || 'bg-gray-100 text-gray-800';
 };

 if (loading && configs.length === 0) {
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
 <h1 className="text-2xl font-bold text-gray-900">Cấu hình hệ thống</h1>
 <p className="text-gray-600">Quản lý cài đặt hệ thống, cờ tính năng và cấu hình</p>
 </div>
 <div className="flex space-x-4">
 {migrationNeeded && (
 <button
 onClick={runMigration}
 disabled={migrationLoading}
 className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors disabled:opacity-50"
 >
 {migrationLoading ? 'Đang chạy...' : 'Chạy di chuyển'}
 </button>
 )}
 <button
 onClick={toggleMaintenanceMode}
 className={`px-4 py-2 rounded-md transition-colors ${
 maintenanceMode
 ? 'bg-red-600 hover:bg-red-700 text-white'
 : 'bg-gray-600 hover:bg-gray-700 text-white'
 }`}
 >
 {maintenanceMode ? 'Tắt bảo trì' : 'Bật bảo trì'}
 </button>
 {/* REMOVED: Add Configuration button - configs are code-first only */}
 </div>
 </div>

 {/* System Status */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="bg-white p-6 rounded-lg shadow">
 <div className="flex items-center">
 <div className={`p-2 rounded-lg ${maintenanceMode ? 'bg-red-100' : 'bg-green-100'}`}>
 <CheckCircle className={`w-6 h-6 ${maintenanceMode ? 'text-red-600' : 'text-green-600'}`} />
 </div>
 <div className="ml-4">
 <p className="text-sm font-medium text-gray-600">System Status</p>
 <p className={`text-2xl font-bold ${maintenanceMode ? 'text-red-600' : 'text-green-600'}`}>
 {maintenanceMode ? 'Maintenance' : 'Operational'}
 </p>
 </div>
 </div>
 </div>

 <div className="bg-white p-6 rounded-lg shadow">
 <div className="flex items-center">
 <div className="p-2 bg-indigo-100 rounded-lg">
 <Settings className="w-6 h-6 text-indigo-600" />
 </div>
 <div className="ml-4">
 <p className="text-sm font-medium text-gray-600">Tổng cấu hình</p>
 <p className="text-2xl font-bold text-gray-900">{configs.length}</p>
 </div>
 </div>
 </div>

 <div className="bg-white p-6 rounded-lg shadow">
 <div className="flex items-center">
 <div className="p-2 bg-green-100 rounded-lg">
 <Shield className="w-6 h-6 text-green-600" />
 </div>
 <div className="ml-4">
 <p className="text-sm font-medium text-gray-600">Tính năng hoạt động</p>
 <p className="text-2xl font-bold text-gray-900">
 {configs.filter(c => c.configType === 'FEATURE' && c.configValue === 'true').length}
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Filters */}
 <div className="bg-white rounded-lg shadow-md p-4 mb-6">
 <div className="flex items-center gap-2">
 <label className="text-sm font-medium text-gray-700">Loại cấu hình:</label>
 <select
 value={filters.type}
 onChange={(e) => handleFilterChange('type', e.target.value)}
 className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
 >
 <option value="">Tất cả loại</option>
 {configTypes.map(type => (
 <option key={type} value={type}>{type}</option>
 ))}
 </select>
 </div>
 </div>

 {error && (
 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
 <strong className="font-bold">Error: </strong>
 <span>{error}</span>
 </div>
 )}

 {/* Info Banner - Explains Config Management */}
 <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
 <div className="flex">
 <div className="flex-shrink-0">
 <Info className="h-5 w-5 text-amber-400" />
 </div>
 <div className="ml-3">
 <p className="text-sm text-amber-700">
 <strong>Lưu ý:</strong> Cấu hình hệ thống được quản lý trong code để đảm bảo ổn định.
 Để thay đổi cấu hình, vui lòng cập nhật trong source code và triển khai lại hệ thống.
 Chức năng chỉnh sửa qua UI đã bị vô hiệu hóa để tránh lỗi nghiêm trọng.
 </p>
 </div>
 </div>
 </div>

 {/* Configurations Table */}
 <div className="bg-white rounded-lg shadow overflow-hidden">
 <table className="min-w-full divide-y divide-gray-200">
 <thead className="bg-gray-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Khoá
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Giá trị
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Loại
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Mô tả
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Hiển thị
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Hoạt động
 </th>
 </tr>
 </thead>
 <tbody className="bg-white divide-y divide-gray-200">
 {configs.map((config) => (
 <tr key={config.configKey} className="hover:bg-gray-50">
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="text-sm font-medium text-gray-900">{config.configKey}</div>
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="text-sm text-gray-900 max-w-xs truncate" title={config.configValue}>
 {config.configValue}
 </div>
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(config.configType)}`}>
 {config.configType}
 </span>
 </td>
 <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
 <div className="truncate" title={config.description}>
 {config.description || 'Không có mô tả'}
 </div>
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
 config.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
 }`}>
 {config.isPublic ? 'Công khai' : 'Riêng tư'}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
 <span className="text-gray-400 text-xs italic">Chỉ xem</span>
 {/* Edit and delete functionality removed to prevent production-breaking changes */}
 </td>
 </tr>
 ))}
 </tbody>
 </table>

 {configs.length === 0 && !loading && (
 <div className="text-center py-8">
 <p className="text-gray-500">Không tìm thấy cấu hình</p>
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
 Previous
 </button>
 <button
 onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
 disabled={currentPage >= totalPages - 1}
 className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
 >
 Next
 </button>
 </div>
 <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
 <div>
 <p className="text-sm text-gray-700">
 Showing page <span className="font-medium">{currentPage + 1}</span> of{' '}
 <span className="font-medium">{totalPages}</span>
 </p>
 </div>
 </div>
 </div>
 )}
 </div>
 </AdminLayout>
 );
};

export default SystemConfig;