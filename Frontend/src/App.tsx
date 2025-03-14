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
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/products"
              element={
                <PrivateRoute allowedRoles={['store_manager']}>
                  <DashboardLayout>
                    <ProductManagement />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <PrivateRoute allowedRoles={['hod']}>
                  <DashboardLayout>
                    <RequestReview />
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
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
