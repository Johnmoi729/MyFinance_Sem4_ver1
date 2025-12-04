import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Github } from '../icons';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-xl">M</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">MyFinance</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            Quản lý tài chính cá nhân thông minh và hiệu quả.
                            Theo dõi thu chi, lập kế hoạch ngân sách và đạt được mục tiêu tài chính của bạn.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Liên kết
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors font-medium">
                                    Tổng quan
                                </Link>
                            </li>
                            <li>
                                <Link to="/transactions" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors font-medium">
                                    Giao dịch
                                </Link>
                            </li>
                            <li>
                                <Link to="/budgets" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors font-medium">
                                    Ngân sách
                                </Link>
                            </li>
                            <li>
                                <Link to="/analytics" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors font-medium">
                                    Phân tích
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Hỗ trợ
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/getting-started" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors font-medium">
                                    Bắt đầu
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors font-medium">
                                    Câu hỏi thường gặp
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors font-medium">
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors font-medium">
                                    Liên hệ
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-500 text-sm">
                            © {currentYear} MyFinance. Tất cả quyền được bảo lưu.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors font-medium">
                                Chính sách bảo mật
                            </a>
                            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors font-medium">
                                Điều khoản
                            </a>
                            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition-colors font-medium">
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;