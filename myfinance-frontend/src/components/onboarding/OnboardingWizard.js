import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingAPI } from '../../services/api';
import { X, CheckCircle, User, Receipt, Target, BarChart3, ChevronRight } from '../icons';

const OnboardingWizard = ({ onClose, onComplete }) => {
 const navigate = useNavigate();
 const [currentStep, setCurrentStep] = useState(1);
 const [progress, setProgress] = useState(null);
 const [loading, setLoading] = useState(false);

 const steps = [
 {
 number: 1,
 title: 'Hoàn thiện hồ sơ',
 description: 'Cập nhật thông tin cá nhân để cá nhân hóa trải nghiệm',
 icon: User,
 action: 'Cập nhật hồ sơ',
 route: '/profile',
 color: 'indigo'
 },
 {
 number: 2,
 title: 'Thêm giao dịch đầu tiên',
 description: 'Ghi lại thu nhập hoặc chi tiêu đầu tiên của bạn',
 icon: Receipt,
 action: 'Thêm giao dịch',
 route: '/transactions/add',
 color: 'green'
 },
 {
 number: 3,
 title: 'Tạo ngân sách',
 description: 'Thiết lập ngân sách để kiểm soát chi tiêu',
 icon: Target,
 action: 'Tạo ngân sách',
 route: '/budgets/add',
 color: 'violet'
 },
 {
 number: 4,
 title: 'Xem báo cáo',
 description: 'Khám phá các báo cáo tài chính của bạn',
 icon: BarChart3,
 action: 'Xem báo cáo',
 route: '/reports/monthly',
 color: 'blue'
 }
 ];

 useEffect(() => {
 loadProgress();
 }, []);

 const loadProgress = async () => {
 try {
 const response = await onboardingAPI.getProgress();
 if (response && response.success) {
 setProgress(response.data);
 setCurrentStep(response.data.currentStep || 1);
 }
 } catch (error) {
 console.error('Error loading onboarding progress:', error);
 }
 };

 const handleStepAction = async (step) => {
 // Navigate to the step's route
 navigate(step.route);

 // Mark step as completed
 try {
 await onboardingAPI.completeStep(step.number);
 } catch (error) {
 console.error('Error completing step:', error);
 }

 // Close wizard
 onClose();
 };

 const handleSkip = async () => {
 if (window.confirm('Bạn có chắc chắn muốn bỏ qua hướng dẫn? Bạn có thể quay lại sau.')) {
 try {
 setLoading(true);
 await onboardingAPI.skipOnboarding();
 onClose();
 } catch (error) {
 console.error('Error skipping onboarding:', error);
 } finally {
 setLoading(false);
 }
 }
 };

 const handleComplete = async () => {
 try {
 setLoading(true);
 await onboardingAPI.completeOnboarding();
 if (onComplete) {
 onComplete();
 }
 onClose();
 } catch (error) {
 console.error('Error completing onboarding:', error);
 } finally {
 setLoading(false);
 }
 };

 const getStepStatus = (stepNumber) => {
 if (!progress) return 'pending';

 const stepCompletedMap = {
 1: progress.step1Completed,
 2: progress.step2Completed,
 3: progress.step3Completed,
 4: progress.step4Completed
 };

 return stepCompletedMap[stepNumber] ? 'completed' : 'pending';
 };

 const completedStepsCount = progress ? progress.stepsCompleted : 0;
 const progressPercentage = progress ? progress.progressPercentage : 0;

 return (
 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
 <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
 {/* Header */}
 <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 rounded-t-2xl text-white">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-2xl font-bold">Chào mừng đến với MyFinance!</h2>
 <button
 onClick={onClose}
 className="text-white hover:text-gray-200 transition-colors"
 >
 <X className="w-6 h-6" />
 </button>
 </div>
 <p className="text-indigo-100">
 Hoàn thành 4 bước đơn giản để bắt đầu quản lý tài chính hiệu quả
 </p>

 {/* Progress Bar */}
 <div className="mt-4">
 <div className="flex items-center justify-between mb-2">
 <span className="text-sm text-indigo-100">
 Tiến độ: {completedStepsCount}/4 bước
 </span>
 <span className="text-sm text-indigo-100">
 {Math.round(progressPercentage)}%
 </span>
 </div>
 <div className="w-full bg-indigo-400 bg-opacity-30 rounded-full h-2">
 <div
 className="bg-white rounded-full h-2 transition-all duration-500"
 style={{ width: `${progressPercentage}%` }}
 ></div>
 </div>
 </div>
 </div>

 {/* Steps */}
 <div className="p-6">
 <div className="space-y-4">
 {steps.map((step) => {
 const status = getStepStatus(step.number);
 const Icon = step.icon;
 const isCompleted = status === 'completed';
 const isCurrent = currentStep === step.number;

 return (
 <div
 key={step.number}
 className={`border-2 rounded-xl p-4 transition-all ${
 isCompleted
 ? 'border-green-500 bg-green-50'
 : isCurrent
 ? `border-${step.color}-500 bg-${step.color}-50`
 : 'border-gray-200 bg-white'
 }`}
 >
 <div className="flex items-center gap-4">
 {/* Step Icon */}
 <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
 isCompleted
 ? 'bg-green-500'
 : `bg-${step.color}-500`
 }`}>
 {isCompleted ? (
 <CheckCircle className="w-6 h-6 text-white" />
 ) : (
 <Icon className="w-6 h-6 text-white" />
 )}
 </div>

 {/* Step Content */}
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-1">
 <h3 className="font-semibold text-gray-900">
 {step.title}
 </h3>
 {isCompleted && (
 <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
 Hoàn thành
 </span>
 )}
 </div>
 <p className="text-sm text-gray-600">
 {step.description}
 </p>
 </div>

 {/* Action Button */}
 {!isCompleted && (
 <button
 onClick={() => handleStepAction(step)}
 className={`px-4 py-2 bg-${step.color}-600 text-white rounded-lg hover:bg-${step.color}-700 flex items-center gap-2 transition-colors whitespace-nowrap`}
 >
 {step.action}
 <ChevronRight className="w-4 h-4" />
 </button>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Footer */}
 <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-between items-center">
 <button
 onClick={handleSkip}
 disabled={loading}
 className="text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
 >
 Bỏ qua hướng dẫn
 </button>

 {completedStepsCount === 4 && (
 <button
 onClick={handleComplete}
 disabled={loading}
 className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
 >
 {loading ? 'Đang xử lý...' : 'Hoàn thành hướng dẫn'}
 </button>
 )}
 </div>
 </div>
 </div>
 );
};

export default OnboardingWizard;
