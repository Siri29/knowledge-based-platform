import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';
import { Container } from 'react-bootstrap';

import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import SpacePage from './pages/SpacePage';
import PageEditor from './pages/PageEditor';
import PageView from './pages/PageView';
import SearchPage from './pages/SearchPage';
import TemplatesPage from './pages/TemplatesPage';
import ActivityPage from './pages/ActivityPage';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return (
    <Container className="d-flex justify-content-center mt-5">
      <div className="spinner-border" role="status"></div>
    </Container>
  );
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            } />
            <Route path="/templates" element={
              <ProtectedRoute>
                <TemplatesPage />
              </ProtectedRoute>
            } />
            <Route path="/activity" element={
              <ProtectedRoute>
                <ActivityPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/spaces/:spaceId" element={
              <ProtectedRoute>
                <SpacePage />
              </ProtectedRoute>
            } />
            <Route path="/pages/:pageId" element={
              <ProtectedRoute>
                <PageView />
              </ProtectedRoute>
            } />
            <Route path="/pages/:pageId/edit" element={
              <ProtectedRoute>
                <PageEditor />
              </ProtectedRoute>
            } />
            <Route path="/spaces/:spaceId/new-page" element={
              <ProtectedRoute>
                <PageEditor />
              </ProtectedRoute>
            } />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
