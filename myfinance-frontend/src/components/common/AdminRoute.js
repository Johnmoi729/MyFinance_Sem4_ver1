import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
 const { isAuthenticated, isAdmin, loading } = useAuth();

 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-gray-50">
 <div className="text-center">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
 <p className="mt-4 text-gray-600">Loading...</p>
 </div>
 </div>
 );
 }

 if (!isAuthenticated) {
 return <Navigate to="/login" replace />;
 }

 if (!isAdmin()) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-gray-50">
 <div className="text-center">
 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
 <strong className="font-bold">Access Denied</strong>
 <p className="block sm:inline">You don't have permission to access admin panel.</p>
 </div>
 <a
 href="/dashboard"
 className="text-blue-600 hover:text-blue-500 underline"
 >
 Return to Dashboard
 </a>
 </div>
 </div>
 );
 }

 return children;
};

export default AdminRoute;