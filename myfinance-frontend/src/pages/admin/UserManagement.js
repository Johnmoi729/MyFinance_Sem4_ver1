import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import SearchFilter from '../../components/common/SearchFilter';
import { Users, UserCheck, UserX } from '../../components/icons';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActive, setFilterActive] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: currentPage,
                size: 10,
                sortBy: 'createdAt',
                sortDir: 'desc'
            };

            if (searchTerm) params.search = searchTerm;
            if (filterActive !== '') params.isActive = filterActive;

            const response = await adminAPI.getUsers(params);

            if (response && response.success) {
                setUsers(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
            } else {
                setError(response?.message || 'Failed to load users');
            }
        } catch (err) {
            console.error('Users fetch error:', err);
            setError('Error loading users');
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, filterActive]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleUserStatusChange = async (userId, isActive) => {
        try {
            const statusData = {
                isActive: !isActive,
                reason: !isActive ? 'Account activated by admin' : 'Account deactivated by admin'
            };

            const response = await adminAPI.updateUserStatus(userId, statusData);

            if (response && response.success) {
                fetchUsers(); // Refresh the list
            } else {
                alert(response?.message || 'Failed to update user status');
            }
        } catch (err) {
            console.error('Status update error:', err);
            alert('Error updating user status');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading && users.length === 0) {
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
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600">Manage user accounts and permissions</p>
                </div>

                {/* Filters */}
                <SearchFilter
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    onSearchClear={() => setSearchTerm('')}
                    searchPlaceholder="Tìm kiếm theo tên hoặc email..."
                    filterOptions={[
                        { value: '', label: 'All Users', icon: Users },
                        { value: 'true', label: 'Active', icon: UserCheck, activeClass: 'bg-green-600 text-white shadow-md' },
                        { value: 'false', label: 'Inactive', icon: UserX, activeClass: 'bg-red-600 text-white shadow-md' }
                    ]}
                    activeFilter={filterActive}
                    onFilterChange={setFilterActive}
                />

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <strong className="font-bold">Error: </strong>
                        <span>{error}</span>
                    </div>
                )}

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                                                {user.fullName?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.fullName || 'No Name'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {user.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email}</div>
                                        {user.isEmailVerified && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Verified
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleUserStatusChange(user.id, user.isActive)}
                                            className={`px-3 py-1 rounded text-xs ${
                                                user.isActive
                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            } transition-colors`}
                                        >
                                            {user.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button className="px-3 py-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded text-xs transition-colors">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users.length === 0 && !loading && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No users found</p>
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
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                        disabled={currentPage === 0}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
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

export default UserManagement;