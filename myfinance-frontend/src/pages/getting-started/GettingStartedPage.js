import React from 'react';
import { Link } from 'react-router-dom';
import { User, Tag, Plus, Calculator, BarChart3, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const GettingStartedPage = () => {
 const steps = [
 {
 icon: <User className="w-8 h-8" />,
 title: 'Tạo tài khoản',
 description: 'Đăng ký tài khoản miễn phí chỉ trong vài giây với email của bạn.',
 link: '/register'
 },
 {
 icon: <Tag className="w-8 h-8" />,
 title: 'Tạo danh mục',
 description: 'Tạo các danh mục thu chi phù hợp với nhu cầu của bạn hoặc sử dụng danh mục mặc định.',
 link: '/categories'
 },
 {
 icon: <Plus className="w-8 h-8" />,
 title: 'Thêm giao dịch',
 description: 'Ghi lại các khoản thu chi hàng ngày để theo dõi tài chính của bạn.',
 link: '/transactions/add'
 },
 {
 icon: <Calculator className="w-8 h-8" />,
 title: 'Lập ngân sách',
 description: 'Thiết lập ngân sách cho từng danh mục để kiểm soát chi tiêu hiệu quả.',
 link: '/budgets/add'
 },
 {
 icon: <BarChart3 className="w-8 h-8" />,
 title: 'Xem báo cáo',
 description: 'Phân tích thói quen chi tiêu qua báo cáo và biểu đồ trực quan.',
 link: '/analytics'
 }
 ];

 return (
 <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
 {/* Hero */}
 <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
 <div className="container-custom py-16 sm:py-20">
 <div className="max-w-3xl mx-auto text-center">
 <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6">Bắt đầu với MyFinance</h1>
 <p className="text-lg sm:text-xl text-indigo-100">
 Hướng dẫn nhanh giúp bạn bắt đầu quản lý tài chính hiệu quả
 </p>
 </div>
 </div>
 </div>

 {/* Steps */}
 <div className="section">
 <div className="container-custom">
 <div className="max-w-5xl mx-auto">
 <div className="space-y-6 sm:space-y-8">
 {steps.map((step, index) => (
 <div key={index} className="card group hover:shadow-colored-indigo">
 <div className="card-body">
 <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
 <div className="flex items-center gap-4 sm:gap-6">
 <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl sm:text-2xl shadow-lg">
 {index + 1}
 </div>
 <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
 {step.icon}
 </div>
 </div>
 <div className="flex-1">
 <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
 <p className="text-gray-600 text-sm sm:text-base">{step.description}</p>
 </div>
 <Link to={step.link} className="btn-primary btn-sm self-start sm:self-center whitespace-nowrap">
 Bắt đầu
 </Link>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Tips */}
 <div className="section bg-gray-50">
 <div className="container-custom">
 <div className="max-w-4xl mx-auto">
 <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">Mẹo hữu ích</h2>
 <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
 <div className="card">
 <div className="card-body">
 <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
 <CheckCircle className="w-6 h-6 text-green-600" />
 </div>
 <h3 className="text-lg font-bold mb-2">Ghi chép thường xuyên</h3>
 <p className="text-gray-600 text-sm">Cập nhật giao dịch hàng ngày để có cái nhìn chính xác nhất về tài chính</p>
 </div>
 </div>
 <div className="card">
 <div className="card-body">
 <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
 <Clock className="w-6 h-6 text-orange-600" />
 </div>
 <h3 className="text-lg font-bold mb-2">Đặt ngân sách thực tế</h3>
 <p className="text-gray-600 text-sm">Thiết lập ngân sách dựa trên thu nhập và nhu cầu thực tế của bạn</p>
 </div>
 </div>
 <div className="card">
 <div className="card-body">
 <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
 <BarChart3 className="w-6 h-6 text-indigo-600" />
 </div>
 <h3 className="text-lg font-bold mb-2">Xem báo cáo định kỳ</h3>
 <p className="text-gray-600 text-sm">Kiểm tra báo cáo hàng tháng để điều chỉnh kế hoạch tài chính</p>
 </div>
 </div>
 <div className="card">
 <div className="card-body">
 <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
 <TrendingUp className="w-6 h-6 text-purple-600" />
 </div>
 <h3 className="text-lg font-bold mb-2">Theo dõi xu hướng</h3>
 <p className="text-gray-600 text-sm">Sử dụng biểu đồ để nhận biết xu hướng chi tiêu của bạn</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* CTA */}
 <div className="section">
 <div className="container-custom">
 <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 sm:p-12 text-center text-white">
 <h2 className="text-2xl sm:text-3xl font-bold mb-4">Cần hỗ trợ?</h2>
 <p className="text-indigo-100 mb-6 sm:mb-8">Xem câu hỏi thường gặp hoặc liên hệ với chúng tôi</p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Link to="/faq" className="btn-secondary bg-white text-indigo-600 hover:bg-indigo-100 hover:scale-105 border-0 transition-all">
 Câu hỏi thường gặp
 </Link>
 <Link to="/about" className="btn-secondary border-white text-indigo-600 hover:text-white hover:bg-white/30 hover:scale-105 transition-all">
 Về MyFinance
 </Link>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default GettingStartedPage;
