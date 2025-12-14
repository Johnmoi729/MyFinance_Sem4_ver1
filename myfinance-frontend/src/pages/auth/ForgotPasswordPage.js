import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import { Logo } from '../../components/common/Logo';
import { CheckCircle, XCircle, RefreshCw } from '../../components/icons';

const ForgotPasswordPage = () => {
 const [email, setEmail] = useState('');
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [success, setSuccess] = useState(false);

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');
 setLoading(true);

 try {
 const response = await userAPI.forgotPassword(email);

 if (response && response.success) {
 setSuccess(true);
 } else {
 setError(response.message || 'Không thể gửi email. Vui lòng thử lại.');
 }
 } catch (err) {
 setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
 } finally {
 setLoading(false);
 }
 };

 if (success) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 py-12 px-4 sm:px-6 lg:px-8">
 <div className="max-w-md w-full space-y-8">
 <div className="text-center">
 <div className="flex justify-center mb-6">
 <Logo size="large" showText={false} linkEnabled={false} />
 </div>
 <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
 <CheckCircle className="h-10 w-10 text-green-600" />
 </div>
 <h2 className="mt-6 text-3xl font-bold text-gray-900">
 Email đã được gửi!
 </h2>
 <p className="mt-2 text-sm text-gray-600">
 Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
 </p>
 <p className="mt-4 text-sm text-gray-500">
 Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn để đặt lại mật khẩu.
 Email có thể mất vài phút để đến.
 </p>
 <div className="mt-6">
 <Link
 to="/login"
 className="text-indigo-600 hover:text-indigo-700 font-medium"
 >
 ← Quay lại đăng nhập
 </Link>
 </div>
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 py-12 px-4 sm:px-6 lg:px-8">
 <div className="max-w-md w-full space-y-8">
 {/* Logo and Title */}
 <div className="text-center">
 <div className="flex justify-center mb-6">
 <Logo size="large" showText={false} linkEnabled={false} />
 </div>
 <h2 className="text-3xl font-bold text-gray-900">
 Quên mật khẩu?
 </h2>
 <p className="mt-2 text-sm text-gray-600">
 Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu
 </p>
 </div>

 <div className="card">
 <div className="card-body">
 <form onSubmit={handleSubmit} className="space-y-5">
 {error && (
 <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl">
 <div className="flex items-center">
 <XCircle className="w-5 h-5 mr-2" />
 {error}
 </div>
 </div>
 )}

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Địa chỉ email
 </label>
 <input
 type="email"
 name="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="input-field"
 placeholder="your@email.com"
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
 Đang gửi...
 </span>
 ) : 'Gửi hướng dẫn đặt lại mật khẩu'}
 </button>

 <div className="text-center mt-4">
 <Link
 to="/login"
 className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
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

export default ForgotPasswordPage;