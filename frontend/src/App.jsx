import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminStoresPage from './pages/AdminStoresPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
            <Navbar />
            <div className="flex-1">
              <Routes>
                {/* Public & User Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Admin Only Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminUsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/stores"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminStoresPage />
                    </ProtectedRoute>
                  }
                />

                {/* Store Owner Only Routes */}
                <Route
                  path="/owner/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                      <OwnerDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Catch-All */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
