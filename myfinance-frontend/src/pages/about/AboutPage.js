import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Lock, Zap, Clipboard, Calculator, BarChart3, ArrowRight } from '../../components/icons';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                <div className="container-custom py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-6 animate-slide-up">
                            Về MyFinance
                        </h1>
                        <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                            Công cụ quản lý tài chính cá nhân thông minh, giúp bạn kiểm soát chi tiêu và đạt được mục tiêu tài chính
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="section">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Sứ mệnh của chúng tôi
                            </h2>
                            <p className="text-lg text-gray-600 mb-4">
                                MyFinance được tạo ra với mục tiêu đơn giản hóa việc quản lý tài chính cá nhân cho mọi người.
                                Chúng tôi tin rằng mọi người đều có quyền tiếp cận với các công cụ tài chính chuyên nghiệp và dễ sử dụng.
                            </p>
                            <p className="text-lg text-gray-600">
                                Với MyFinance, bạn có thể theo dõi thu chi, lập kế hoạch ngân sách, và phân tích thói quen chi tiêu
                                của mình một cách dễ dàng và hiệu quả.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-100 to-violet-100 rounded-3xl p-8 border border-indigo-200">
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Miễn phí 100%</h3>
                                        <p className="text-gray-600">Tất cả tính năng đều hoàn toàn miễn phí, không có phí ẩn</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Lock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Bảo mật tuyệt đối</h3>
                                        <p className="text-gray-600">Dữ liệu của bạn được mã hóa và bảo vệ tối đa</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Dễ sử dụng</h3>
                                        <p className="text-gray-600">Giao diện thân thiện, dễ hiểu cho mọi người</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="section bg-gray-50">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Tính năng nổi bật
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Mọi thứ bạn cần để quản lý tài chính hiệu quả
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="card text-center group hover:scale-105 transition-transform">
                            <div className="card-body">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <Clipboard className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Quản lý giao dịch</h3>
                                <p className="text-gray-600">Theo dõi mọi khoản thu chi một cách chi tiết và chính xác</p>
                            </div>
                        </div>

                        <div className="card text-center group hover:scale-105 transition-transform">
                            <div className="card-body">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <Calculator className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Lập ngân sách</h3>
                                <p className="text-gray-600">Thiết lập và theo dõi ngân sách cho từng hạng mục chi tiêu</p>
                            </div>
                        </div>

                        <div className="card text-center group hover:scale-105 transition-transform">
                            <div className="card-body">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <BarChart3 className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Báo cáo & Phân tích</h3>
                                <p className="text-gray-600">Xem báo cáo chi tiết và phân tích thói quen chi tiêu</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="section">
                <div className="container-custom">
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-12 text-center text-white shadow-xl">
                        <h2 className="text-4xl font-bold mb-6">
                            Sẵn sàng kiểm soát tài chính của bạn?
                        </h2>
                        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                            Bắt đầu hành trình quản lý tài chính thông minh ngay hôm nay
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register" className="btn-secondary bg-white text-indigo-600 hover:bg-indigo-50 border-0 inline-flex items-center justify-center">
                                Đăng ký miễn phí
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                            <Link to="/getting-started" className="btn-secondary border-white text-white hover:bg-white/10">
                                Tìm hiểu thêm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
