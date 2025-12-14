import React, { useState } from 'react';
import { ChevronDown, Mail } from '../../components/icons';

const FAQPage = () => {
 const [openIndex, setOpenIndex] = useState(null);

 const faqs = [
 {
 category: 'Tổng quan',
 questions: [
 {
 q: 'MyFinance là gì?',
 a: 'MyFinance là ứng dụng quản lý tài chính cá nhân miễn phí, giúp bạn theo dõi thu chi, lập ngân sách và phân tích thói quen chi tiêu một cách dễ dàng.'
 },
 {
 q: 'MyFinance có miễn phí không?',
 a: 'Có, MyFinance hoàn toàn miễn phí 100% cho tất cả người dùng. Không có phí ẩn hay gói nâng cấp.'
 },
 {
 q: 'Dữ liệu của tôi có an toàn không?',
 a: 'Tất cả dữ liệu được mã hóa và lưu trữ an toàn. Chúng tôi tuân thủ các tiêu chuẩn bảo mật cao nhất để bảo vệ thông tin của bạn.'
 }
 ]
 },
 {
 category: 'Giao dịch',
 questions: [
 {
 q: 'Làm sao để thêm giao dịch mới?',
 a: 'Nhấp vào nút "Thêm giao dịch" trên trang chủ hoặc vào menu Giao dịch, sau đó điền thông tin như số tiền, danh mục, ngày và mô tả.'
 },
 {
 q: 'Tôi có thể chỉnh sửa giao dịch đã thêm không?',
 a: 'Có, bạn có thể chỉnh sửa hoặc xóa bất kỳ giao dịch nào bằng cách nhấp vào giao dịch trong danh sách và chọn "Chỉnh sửa" hoặc "Xóa".'
 },
 {
 q: 'Làm sao để phân loại giao dịch?',
 a: 'Mỗi giao dịch đều phải được gán vào một danh mục. Bạn có thể sử dụng danh mục mặc định hoặc tạo danh mục riêng của mình.'
 }
 ]
 },
 {
 category: 'Ngân sách',
 questions: [
 {
 q: 'Ngân sách hoạt động như thế nào?',
 a: 'Bạn có thể đặt giới hạn chi tiêu cho từng danh mục theo tháng. Hệ thống sẽ cảnh báo khi bạn sắp vượt ngân sách.'
 },
 {
 q: 'Tôi có thể đặt nhiều ngân sách không?',
 a: 'Có, bạn có thể đặt ngân sách riêng biệt cho mỗi danh mục chi tiêu và cho từng tháng khác nhau.'
 },
 {
 q: 'Làm sao để theo dõi ngân sách?',
 a: 'Vào trang Ngân sách để xem tổng quan chi tiết về các ngân sách của bạn, bao gồm số tiền đã chi và số tiền còn lại.'
 }
 ]
 },
 {
 category: 'Báo cáo',
 questions: [
 {
 q: 'Tôi có thể xem báo cáo gì?',
 a: 'MyFinance cung cấp báo cáo tháng, báo cáo năm, báo cáo theo danh mục và phân tích chi tiết với biểu đồ trực quan.'
 },
 {
 q: 'Làm sao để xuất báo cáo?',
 a: 'Trên mỗi trang báo cáo, bạn có thể nhấn nút "Xuất PDF" hoặc "Xuất CSV" để tải báo cáo về máy.'
 },
 {
 q: 'Tôi có thể tùy chỉnh khoảng thời gian báo cáo không?',
 a: 'Có, bạn có thể chọn tháng, năm hoặc khoảng thời gian tùy chỉnh để xem báo cáo chi tiết.'
 }
 ]
 }
 ];

 const toggleFAQ = (index) => {
 setOpenIndex(openIndex === index ? null : index);
 };

 return (
 <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
 {/* Hero */}
 <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
 <div className="container-custom py-16 sm:py-20">
 <div className="max-w-3xl mx-auto text-center">
 <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6">Câu hỏi thường gặp</h1>
 <p className="text-lg sm:text-xl text-indigo-100">
 Tìm câu trả lời cho các câu hỏi thường gặp về MyFinance
 </p>
 </div>
 </div>
 </div>

 {/* FAQ */}
 <div className="section">
 <div className="container-custom">
 <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
 {faqs.map((category, catIndex) => (
 <div key={catIndex}>
 <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">{category.category}</h2>
 <div className="space-y-3 sm:space-y-4">
 {category.questions.map((faq, qIndex) => {
 const globalIndex = `${catIndex}-${qIndex}`;
 const isOpen = openIndex === globalIndex;

 return (
 <div key={qIndex} className="card overflow-hidden">
 <button
 onClick={() => toggleFAQ(globalIndex)}
 className="w-full text-left card-body flex items-center justify-between hover:bg-gray-50 transition-colors"
 >
 <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">{faq.q}</h3>
 <ChevronDown
 className={`w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0 transition-transform ${
 isOpen ? 'rotate-180' : ''
 }`}
 />
 </button>
 {isOpen && (
 <div className="px-6 pb-6 pt-0">
 <div className="border-t border-gray-100 pt-4">
 <p className="text-sm sm:text-base text-gray-600">{faq.a}</p>
 </div>
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Contact */}
 <div className="section bg-gray-50">
 <div className="container-custom">
 <div className="max-w-2xl mx-auto text-center">
 <h2 className="text-2xl sm:text-3xl font-bold mb-4">Không tìm thấy câu trả lời?</h2>
 <p className="text-gray-600 mb-6 sm:mb-8">
 Nếu bạn có câu hỏi khác, đừng ngần ngại liên hệ với chúng tôi
 </p>
 <div className="card">
 <div className="card-body">
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
 <Mail className="w-6 h-6 text-indigo-600" />
 </div>
 <div className="text-left">
 <p className="font-semibold text-gray-900">Liên hệ qua Email</p>
 <p className="text-sm text-gray-600">support@myfinance.com</p>
 </div>
 </div>
 <a href="mailto:support@myfinance.com" className="btn-primary btn-sm whitespace-nowrap">
 Gửi email
 </a>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default FAQPage;
