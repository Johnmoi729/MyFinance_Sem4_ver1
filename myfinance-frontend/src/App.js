import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import { CategoryProvider } from './context/CategoryContext';
import { BudgetProvider } from './context/BudgetContext';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
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

import './App.css';

function App() {
  return (
      <AuthProvider>
        <TransactionProvider>
          <CategoryProvider>
            <BudgetProvider>
            <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
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

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
              </main>
              <Footer />
            </div>
            </Router>
            </BudgetProvider>
          </CategoryProvider>
        </TransactionProvider>
      </AuthProvider>
  );
}

export default App;