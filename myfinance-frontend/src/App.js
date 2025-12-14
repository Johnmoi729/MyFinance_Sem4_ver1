import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PreferencesProvider } from './context/PreferencesContext';
import IntegratedProviders from './components/providers/IntegratedProviders';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import AdminRoute from './components/common/AdminRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import MaintenanceModal from './components/common/MaintenanceModal';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import TransactionsPage from './pages/transactions/TransactionsPage';
import AddTransactionPage from './pages/transactions/AddTransactionPage';
import EditTransactionPage from './pages/transactions/EditTransactionPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import AddCategoryPage from './pages/categories/AddCategoryPage';
import EditCategoryPage from './pages/categories/EditCategoryPage';
import BudgetsPage from './pages/budgets/BudgetsPage';
import AddBudgetPage from './pages/budgets/AddBudgetPage';
import EditBudgetPage from './pages/budgets/EditBudgetPage';
import BudgetSettingsPage from './pages/budgets/BudgetSettingsPage';
import UserPreferencesPage from './pages/preferences/UserPreferencesPage';

// Report Pages
import MonthlyReport from './pages/reports/MonthlyReport';
import YearlyReport from './pages/reports/YearlyReport';
import CategoryReport from './pages/reports/CategoryReport';
import ScheduledReports from './pages/reports/ScheduledReports';

// User Analytics
import UserFinancialAnalytics from './pages/analytics/FinancialAnalytics';

// New UX Pages
import AboutPage from './pages/about/AboutPage';
import GettingStartedPage from './pages/getting-started/GettingStartedPage';
import FAQPage from './pages/faq/FAQPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AuditLogs from './pages/admin/AuditLogs';
import SystemConfig from './pages/admin/SystemConfig';
import AdminFinancialAnalytics from './pages/admin/FinancialAnalytics';

import './App.css';

// Smart Home Redirect Component
const HomeRedirect = () => {
 const { isAdmin, loading } = useAuth();

 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-gray-50">
 <div className="text-center">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
 <p className="text-gray-600">Đang tải...</p>
 </div>
 </div>
 );
 }

 // Redirect admins to admin dashboard, regular users to user dashboard
 return <Navigate to={isAdmin() ? "/admin/dashboard" : "/dashboard"} replace />;
};

function App() {
 return (
 <AuthProvider>
 <PreferencesProvider>
 <IntegratedProviders>
 <Router>
 <div className="min-h-screen bg-gray-50 flex flex-col">
 <Header />
 <main className="flex-1">
 <Routes>
 {/* Smart home route - redirects based on user role */}
 <Route path="/" element={<HomeRedirect />} />
 <Route path="/login" element={
 <PublicRoute>
 <LoginPage />
 </PublicRoute>
 } />
 <Route path="/register" element={
 <PublicRoute>
 <RegisterPage />
 </PublicRoute>
 } />
 <Route path="/forgot-password" element={
 <PublicRoute>
 <ForgotPasswordPage />
 </PublicRoute>
 } />
 <Route path="/reset-password" element={
 <PublicRoute>
 <ResetPasswordPage />
 </PublicRoute>
 } />

 {/* Protected routes */}
 <Route path="/dashboard" element={
 <ProtectedRoute>
 <DashboardPage />
 </ProtectedRoute>
 } />
 <Route path="/profile" element={
 <ProtectedRoute>
 <ProfilePage />
 </ProtectedRoute>
 } />
 <Route path="/transactions" element={
 <ProtectedRoute>
 <TransactionsPage />
 </ProtectedRoute>
 } />
 <Route path="/transactions/add" element={
 <ProtectedRoute>
 <AddTransactionPage />
 </ProtectedRoute>
 } />
 <Route path="/transactions/edit/:id" element={
 <ProtectedRoute>
 <EditTransactionPage />
 </ProtectedRoute>
 } />
 <Route path="/categories" element={
 <ProtectedRoute>
 <CategoriesPage />
 </ProtectedRoute>
 } />
 <Route path="/categories/add" element={
 <ProtectedRoute>
 <AddCategoryPage />
 </ProtectedRoute>
 } />
 <Route path="/categories/edit/:id" element={
 <ProtectedRoute>
 <EditCategoryPage />
 </ProtectedRoute>
 } />
 <Route path="/budgets" element={
 <ProtectedRoute>
 <BudgetsPage />
 </ProtectedRoute>
 } />
 <Route path="/budgets/add" element={
 <ProtectedRoute>
 <AddBudgetPage />
 </ProtectedRoute>
 } />
 <Route path="/budgets/edit/:id" element={
 <ProtectedRoute>
 <EditBudgetPage />
 </ProtectedRoute>
 } />
 <Route path="/budgets/settings" element={
 <ProtectedRoute>
 <BudgetSettingsPage />
 </ProtectedRoute>
 } />
 <Route path="/preferences" element={
 <ProtectedRoute>
 <UserPreferencesPage />
 </ProtectedRoute>
 } />

 {/* Report routes */}
 <Route path="/reports/monthly" element={
 <ProtectedRoute>
 <MonthlyReport />
 </ProtectedRoute>
 } />
 <Route path="/reports/yearly" element={
 <ProtectedRoute>
 <YearlyReport />
 </ProtectedRoute>
 } />
 <Route path="/reports/category" element={
 <ProtectedRoute>
 <CategoryReport />
 </ProtectedRoute>
 } />
 <Route path="/reports/scheduled" element={
 <ProtectedRoute>
 <ScheduledReports />
 </ProtectedRoute>
 } />

 {/* User Analytics */}
 <Route path="/analytics" element={
 <ProtectedRoute>
 <UserFinancialAnalytics />
 </ProtectedRoute>
 } />

 {/* Public Info Pages */}
 <Route path="/about" element={<AboutPage />} />
 <Route path="/getting-started" element={<GettingStartedPage />} />
 <Route path="/faq" element={<FAQPage />} />

 {/* Admin routes */}
 <Route path="/admin/dashboard" element={
 <AdminRoute>
 <AdminDashboard />
 </AdminRoute>
 } />
 <Route path="/admin/users" element={
 <AdminRoute>
 <UserManagement />
 </AdminRoute>
 } />
 <Route path="/admin/audit" element={
 <AdminRoute>
 <AuditLogs />
 </AdminRoute>
 } />
 <Route path="/admin/config" element={
 <AdminRoute>
 <SystemConfig />
 </AdminRoute>
 } />
 <Route path="/admin/analytics" element={
 <AdminRoute>
 <AdminFinancialAnalytics />
 </AdminRoute>
 } />

 {/* Fallback route - also uses smart redirect */}
 <Route path="*" element={<HomeRedirect />} />
 </Routes>
 </main>
 <Footer />

 {/* Maintenance Mode Modal - Shows when backend returns 503 */}
 <MaintenanceModal />
 </div>
 </Router>
 </IntegratedProviders>
 </PreferencesProvider>
 </AuthProvider>
 );
}

export default App;