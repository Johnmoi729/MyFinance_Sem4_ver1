import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { CheckCircle, Settings, Shield } from '../../components/icons';

const SystemConfig = () => {
 const [configs, setConfigs] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [currentPage, setCurrentPage] = useState(0);
 const [totalPages, setTotalPages] = useState(0);
 const [editingConfig, setEditingConfig] = useState(null);
 const [newConfig, setNewConfig] = useState(false);
 const [maintenanceMode, setMaintenanceMode] = useState(false);
 const [migrationNeeded, setMigrationNeeded] = useState(false);
 const [migrationLoading, setMigrationLoading] = useState(false);

 // Filters
 const [filters, setFilters] = useState({
 type: '',
 isPublic: ''
 });

 // Form state for create/edit
 const [formData, setFormData] = useState({
 configKey: '',
 configValue: '',
 description: '',
 configType: 'APPLICATION',
 isPublic: false
 });

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

 const handleFormChange = (key, value) => {
 setFormData(prev => ({
 ...prev,
 [key]: value
 }));
 };

 const openCreateModal = () => {
 setFormData({
 configKey: '',
 configValue: '',
 description: '',
 configType: 'SETTING',
 isPublic: false
 });
 setNewConfig(true);
 setEditingConfig(null);
 };

 const openEditModal = (config) => {
 setFormData({
 configKey: config.configKey,
 configValue: config.configValue,
 description: config.description || '',
 configType: config.configType,
 isPublic: config.isPublic || false
 });
 setEditingConfig(config);
 setNewConfig(false);
 };

 const closeModal = () => {
 setEditingConfig(null);
 setNewConfig(false);
 setFormData({
 configKey: '',
 configValue: '',
 description: '',
 configType: 'SETTING',
 isPublic: false
 });
 };

 const handleSubmit = async (e) => {
 e.preventDefault();

 try {
 let response;
 if (newConfig) {
 // Create new config
 response = await adminAPI.createConfig(formData);
 } else {
 // Update existing config
 response = await adminAPI.updateConfig(editingConfig.configKey, formData);
 }

 if (response && response.success) {
 closeModal();
 fetchConfigs();
 } else {
 alert(response?.message || 'Thao tác thất bại');
 }
 } catch (err) {
 console.error('Config operation error:', err);
 alert('Lỗi khi thực hiện thao tác');
 }
 };

 const handleDelete = async (configKey) => {
 if (!window.confirm('Bạn có chắc chắn muốn xóa cấu hình này?')) {
 return;
 }

 try {
 const response = await adminAPI.deleteConfig(configKey);
 if (response && response.success) {
 fetchConfigs();
 } else {
 alert(response?.message || 'Xóa cấu hình thất bại');
 }
 } catch (err) {
 console.error('Delete config error:', err);
 alert('Lỗi khi xóa cấu hình');
 }
 };

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
 <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
 <p className="text-gray-600">Manage system settings, feature flags, and configuration</p>
 </div>
 <div className="flex space-x-4">
 {migrationNeeded && (
 <button
 onClick={runMigration}
 disabled={migrationLoading}
 className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors disabled:opacity-50"
 >
 {migrationLoading ? 'Running...' : 'Run Migration'}
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
 {maintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}
 </button>
 <button
 onClick={openCreateModal}
 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
 >
 Add Configuration
 </button>
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
 <p className="text-sm font-medium text-gray-600">Total Configs</p>
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
 <p className="text-sm font-medium text-gray-600">Active Features</p>
 <p className="text-2xl font-bold text-gray-900">
 {configs.filter(c => c.configType === 'FEATURE_FLAG' && c.configValue === 'true').length}
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

 {/* Configurations Table */}
 <div className="bg-white rounded-lg shadow overflow-hidden">
 <table className="min-w-full divide-y divide-gray-200">
 <thead className="bg-gray-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Key
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Value
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Type
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Description
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Visibility
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Actions
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
 {config.description || 'No description'}
 </div>
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
 config.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
 }`}>
 {config.isPublic ? 'Public' : 'Private'}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
 <button
 onClick={() => openEditModal(config)}
 className="text-indigo-600 hover:text-indigo-900"
 >
 Edit
 </button>
 <button
 onClick={() => handleDelete(config.configKey)}
 className="text-red-600 hover:text-red-900"
 >
 Delete
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>

 {configs.length === 0 && !loading && (
 <div className="text-center py-8">
 <p className="text-gray-500">No configurations found</p>
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

 {/* Create/Edit Modal */}
 {(newConfig || editingConfig) && (
 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
 <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
 <div className="mt-3">
 <h3 className="text-lg font-medium text-gray-900 mb-4">
 {newConfig ? 'Create Configuration' : 'Edit Configuration'}
 </h3>
 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Config Key *
 </label>
 <input
 type="text"
 value={formData.configKey}
 onChange={(e) => handleFormChange('configKey', e.target.value)}
 disabled={!newConfig}
 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
 required
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Config Value *
 </label>
 <textarea
 value={formData.configValue}
 onChange={(e) => handleFormChange('configValue', e.target.value)}
 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
 rows={3}
 required
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Type
 </label>
 <select
 value={formData.configType}
 onChange={(e) => handleFormChange('configType', e.target.value)}
 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
 >
 {configTypes.map(type => (
 <option key={type} value={type}>{type}</option>
 ))}
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Description
 </label>
 <textarea
 value={formData.description}
 onChange={(e) => handleFormChange('description', e.target.value)}
 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
 rows={2}
 />
 </div>
 <div className="flex items-center">
 <input
 type="checkbox"
 id="isPublic"
 checked={formData.isPublic}
 onChange={(e) => handleFormChange('isPublic', e.target.checked)}
 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
 />
 <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
 Public configuration
 </label>
 </div>
 <div className="flex justify-end space-x-4 pt-4">
 <button
 type="button"
 onClick={closeModal}
 className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
 >
 {newConfig ? 'Create' : 'Update'}
 </button>
 </div>
 </form>
 </div>
 </div>
 </div>
 )}
 </div>
 </AdminLayout>
 );
};

export default SystemConfig;