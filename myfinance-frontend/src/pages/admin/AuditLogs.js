import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';

const AuditLogs = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Filters
    const [filters, setFilters] = useState({
        userId: '',
        adminUserId: '',
        action: '',
        entityType: '',
        startDate: '',
        endDate: ''
    });

    // Available filter options
    const actionTypes = [
        'USER_LOGIN', 'USER_REGISTER', 'USER_ACTIVATE', 'USER_DEACTIVATE',
        'TRANSACTION_CREATE', 'TRANSACTION_UPDATE', 'TRANSACTION_DELETE',
        'BUDGET_CREATE', 'BUDGET_UPDATE', 'BUDGET_DELETE',
        'CATEGORY_CREATE', 'CATEGORY_UPDATE', 'CATEGORY_DELETE',
        'CONFIG_CREATE', 'CONFIG_UPDATE', 'CONFIG_DELETE',
        'ADMIN_ACCESS', 'ADMIN_USER_CREATE', 'UNAUTHORIZED_ACCESS'
    ];

    const entityTypes = [
        'User', 'Transaction', 'Budget', 'Category', 'SystemConfig', 'AuditLog', 'Admin'
    ];

    useEffect(() => {
        fetchAuditLogs();
    }, [currentPage, filters]);

    const fetchAuditLogs = async () => {
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
                    params[key] = filters[key];
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
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setCurrentPage(0); // Reset to first page when filtering
    };

    const clearFilters = () => {
        setFilters({
            userId: '',
            adminUserId: '',
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
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getActionBadgeColor = (action) => {
        if (action?.includes('CREATE')) return 'bg-green-100 text-green-800';
        if (action?.includes('UPDATE')) return 'bg-blue-100 text-blue-800';
        if (action?.includes('DELETE')) return 'bg-red-100 text-red-800';
        if (action?.includes('LOGIN')) return 'bg-purple-100 text-purple-800';
        if (action?.includes('UNAUTHORIZED')) return 'bg-red-100 text-red-800';
        if (action?.includes('ADMIN')) return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100 text-gray-800';
    };

    const exportAuditLogs = async () => {
        try {
            // This would typically trigger a file download
            alert('Export functionality will be implemented in the next phase');
        } catch (err) {
            alert('Export failed');
        }
    };

    if (loading && auditLogs.length === 0) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                        <p className="text-gray-600">
                            System activity monitoring and security audit trail ({totalElements} total entries)
                        </p>
                    </div>
                    <button
                        onClick={exportAuditLogs}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Export Logs
                    </button>
                </div>

                {/* Advanced Filters */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Filters</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                            <input
                                type="number"
                                value={filters.userId}
                                onChange={(e) => handleFilterChange('userId', e.target.value)}
                                placeholder="Filter by user ID..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Admin User ID</label>
                            <input
                                type="number"
                                value={filters.adminUserId}
                                onChange={(e) => handleFilterChange('adminUserId', e.target.value)}
                                placeholder="Filter by admin user ID..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
                            <select
                                value={filters.action}
                                onChange={(e) => handleFilterChange('action', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Actions</option>
                                {actionTypes.map(action => (
                                    <option key={action} value={action}>{action}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Entity Type</label>
                            <select
                                value={filters.entityType}
                                onChange={(e) => handleFilterChange('entityType', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Entities</option>
                                {entityTypes.map(entity => (
                                    <option key={entity} value={entity}>{entity}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input
                                type="datetime-local"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input
                                type="datetime-local"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex space-x-4">
                        <button
                            onClick={() => fetchAuditLogs()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <strong className="font-bold">Error: </strong>
                        <span>{error}</span>
                    </div>
                )}

                {/* Audit Logs Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Timestamp
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Entity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        IP Address
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {auditLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatTimestamp(log.timestamp)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>
                                                <div className="font-medium">{log.entityType}</div>
                                                {log.entityId && (
                                                    <div className="text-gray-500">ID: {log.entityId}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>
                                                {log.userId && (
                                                    <div className="font-medium">User: {log.userId}</div>
                                                )}
                                                {log.adminUserId && (
                                                    <div className="text-blue-600">Admin: {log.adminUserId}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                            <div className="truncate" title={log.details}>
                                                {log.details || 'No details'}
                                            </div>
                                            {log.oldValue && log.newValue && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    <span className="text-red-600">{log.oldValue}</span> →
                                                    <span className="text-green-600"> {log.newValue}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>
                                                {log.ipAddress}
                                                {log.userAgent && (
                                                    <div className="text-xs truncate max-w-xs" title={log.userAgent}>
                                                        {log.userAgent}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {auditLogs.length === 0 && !loading && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No audit logs found</p>
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
                                    {' '}({totalElements} total entries)
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                        disabled={currentPage === 0}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNumber = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => setCurrentPage(pageNumber)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    currentPage === pageNumber
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
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
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AuditLogs;