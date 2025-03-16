import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import DashboardLayout from './components/Layout/DashboardLayout';
import Login from './pages/Auth/Login';
import Dashboard from './pages/StoreManager/Dashboard';
import ProductManagement from './pages/StoreManager/ProductManagement';
import RequestReview from './pages/HOD/RequestReview';
import ApproveRequests from './pages/HOD/ApproveRequests';
import VendorManagement from './pages/StoreManager/VendorManagement';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('store_manager' | 'hod')[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/products" element={<ProductManagement />} />
                      <Route path="/requests" element={<RequestReview />} />
                      <Route path="/vendors" element={<VendorManagement />} />
                    </Routes>
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/approve-requests"
              element={
                <PrivateRoute allowedRoles={['hod']}>
                  <DashboardLayout>
                    <ApproveRequests />
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
