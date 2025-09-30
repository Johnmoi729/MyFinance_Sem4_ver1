import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, loading, isAdmin } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (!formData.email || !formData.password) {
            setMessage({ text: 'Vui lòng điền đầy đủ thông tin', type: 'error' });
            return;
        }

        const result = await login(formData);

        if (result.success) {
            // Check if user is admin using the login response data directly
            const userRoles = result.data.roles || [];
            const isUserAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');

            if (isUserAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } else {
            setMessage({ text: result.message, type: 'error' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Đăng nhập vào MyFinance
                    </h2>
                </div>

                <div className="bg-white py-8 px-6 shadow rounded-lg">
                    {message.text && (
                        <div className={`mb-4 p-4 rounded-md ${
                            message.type === 'success'
                                ? 'bg-green-100 text-green-700 border border-green-300'
                                : 'bg-red-100 text-red-700 border border-red-300'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
                                loading
                                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="text-blue-600 hover:text-blue-500 text-sm"
                            >
                                Chưa có tài khoản? Đăng ký ngay
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;