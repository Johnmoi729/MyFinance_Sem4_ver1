import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { userAPI } from '../../services/api';
import { Logo } from '../../components/common/Logo';
import { CheckCircle, XCircle, RefreshCw } from '../../components/icons';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmNewPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Token không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu mới.');
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.newPassword !== formData.confirmNewPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        // Validate password length
        if (formData.newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);

        try {
            const response = await userAPI.resetPassword({
                token: token,
                newPassword: formData.newPassword,
                confirmNewPassword: formData.confirmNewPassword
            });

            if (response && response.success) {
                setSuccess(true);
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(response.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <Logo size="large" showText={false} linkEnabled={false} />
                        </div>
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30">
                            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-50">
                            Link không hợp lệ
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/forgot-password"
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                            >
                                Yêu cầu link mới →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <Logo size="large" showText={false} linkEnabled={false} />
                        </div>
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30">
                            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-50">
                            Đặt lại mật khẩu thành công!
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Mật khẩu của bạn đã được đặt lại thành công.
                        </p>
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Đang chuyển hướng đến trang đăng nhập...
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                            >
                                Đăng nhập ngay →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Logo and Title */}
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <Logo size="large" showText={false} linkEnabled={false} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                        Đặt lại mật khẩu
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Nhập mật khẩu mới cho tài khoản của bạn
                    </p>
                </div>

                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 p-4 rounded-xl">
                                    <div className="flex items-center">
                                        <XCircle className="w-5 h-5 mr-2" />
                                        {error}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Xác nhận mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    value={formData.confirmNewPassword}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="Nhập lại mật khẩu mới"
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
                                ) : 'Đặt lại mật khẩu'}
                            </button>

                            <div className="text-center mt-4">
                                <Link
                                    to="/login"
                                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                                >
                                    ← Quay lại đăng nhập
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
