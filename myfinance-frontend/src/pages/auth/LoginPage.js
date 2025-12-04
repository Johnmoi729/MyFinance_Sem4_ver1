import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import { CheckCircle, XCircle, RefreshCw } from '../../components/icons';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Logo and Title */}
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <Logo size="large" showText={false} linkEnabled={false} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                        Chào mừng trở lại
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Đăng nhập để quản lý tài chính của bạn
                    </p>
                </div>

                <div className="card">
                    <div className="card-body">
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-xl ${
                                message.type === 'success'
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                            }`}>
                                <div className="flex items-center">
                                    {message.type === 'success' ? (
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                    ) : (
                                        <XCircle className="w-5 h-5 mr-2" />
                                    )}
                                    {message.text}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end">
                                <button
                                    type="button"
                                    onClick={() => navigate('/forgot-password')}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                        Đang xử lý...
                                    </span>
                                ) : 'Đăng nhập'}
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Chưa có tài khoản?</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="btn-secondary w-full"
                            >
                                Đăng ký ngay
                            </button>
                        </form>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    Bằng việc đăng nhập, bạn đồng ý với{' '}
                    <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Điều khoản dịch vụ</a>
                    {' '}và{' '}
                    <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Chính sách bảo mật</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;