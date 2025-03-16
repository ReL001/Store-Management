import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DashboardLayout from './components/Layout/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import VendorManagement from './pages/StoreManager/VendorManagement';
import ProductManagement from './pages/StoreManager/ProductManagement';
import RequestReview from './pages/HOD/RequestReview';
import ApproveRequests from './pages/HOD/ApproveRequests';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="vendors" element={<VendorManagement />} />
                      <Route path="products" element={<ProductManagement />} />
                      <Route path="requests" element={<RequestReview />} />
                      <Route path="approve" element={<ApproveRequests />} />
                    </Routes>
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
