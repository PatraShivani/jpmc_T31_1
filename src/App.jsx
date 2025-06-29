import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Families from './pages/Families';
import Students from './pages/Students';
import Women from './pages/Women';
import AIChat from './pages/AIChat';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import Volunteers from './pages/Volunteers';
import StudentReports from './pages/StudentReports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<LandingPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/families" element={
            <ProtectedRoute>
              <Layout>
                <Families />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/students" element={
            <ProtectedRoute>
              <Layout>
                <Students />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/women" element={
            <ProtectedRoute>
              <Layout>
                <Women />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/ai-chat" element={
            <ProtectedRoute>
              <Layout>
                <AIChat />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/volunteers" element={
            <ProtectedRoute>
              <Layout>
                <Volunteers />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout>
                <StudentReports />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
