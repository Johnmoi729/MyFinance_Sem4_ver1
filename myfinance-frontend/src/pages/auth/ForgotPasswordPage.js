import React from 'react';

const ForgotPasswordPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Quên mật khẩu</h1>
                <p className="text-gray-600 mb-4">Tính năng này sẽ được phát triển sau.</p>
                <button
                    onClick={() => window.location.href = '/login'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Quay lại đăng nhập
                </button>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;