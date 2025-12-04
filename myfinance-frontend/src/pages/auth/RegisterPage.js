import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import { CheckCircle, XCircle, RefreshCw } from '../../components/icons';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
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

        if (!formData.email || !formData.password || !formData.fullName) {
            setMessage({ text: 'Vui lòng điền đầy đủ thông tin', type: 'error' });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage({ text: 'Mật khẩu xác nhận không khớp', type: 'error' });
            return;
        }

        const result = await register(formData);

        if (result.success) {
            setMessage({ text: 'Đăng ký thành công! Vui lòng đăng nhập.', type: 'success' });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
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
                        Tạo tài khoản mới
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Bắt đầu quản lý tài chính thông minh ngay hôm nay
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
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Nguyễn Văn A"
                                    required
                                />
                            </div>

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
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Ít nhất 8 ký tự</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Xác nhận mật khẩu
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full mt-6"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        Đang xử lý...
                                    </span>
                                ) : 'Tạo tài khoản'}
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Đã có tài khoản?</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="btn-secondary w-full"
                            >
                                Đăng nhập ngay
                            </button>
                        </form>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    Bằng việc đăng ký, bạn đồng ý với{' '}
                    <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Điều khoản dịch vụ</a>
                    {' '}và{' '}
                    <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Chính sách bảo mật</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;