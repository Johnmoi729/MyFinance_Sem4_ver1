import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Hồ sơ người dùng</h1>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 text-sm text-gray-900">{user?.email || 'Chưa có thông tin'}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                            <p className="mt-1 text-sm text-gray-900">{user?.fullName || 'Chưa có thông tin'}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Quay lại Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;