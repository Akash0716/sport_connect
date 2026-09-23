import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import MainLayout from './layouts/MainLayout';
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import PlayerDashboard from './pages/player/PlayerDashboard';
import BrowseSessionsPage from './pages/player/BrowseSessionsPage';
import CreateSessionPage from './pages/player/CreateSessionPage';
import MySessionsPage from './pages/player/MySessionsPage';
import ProfilePage from './pages/player/ProfilePage';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageSportsPage from './pages/admin/ManageSportsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes (Main Layout Wrapper) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<PlayerDashboard />} />
                <Route path="/sessions" element={<BrowseSessionsPage />} />
                <Route path="/create-session" element={<CreateSessionPage />} />
                <Route path="/my-sessions" element={<MySessionsPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Admin-Only Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/sports" element={<ManageSportsPage />} />
                  <Route path="/admin/reports" element={<AdminReportsPage />} />
                </Route>
              </Route>
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
