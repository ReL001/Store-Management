import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import DashboardLayout from "./components/Layout/DashboardLayout";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/StoreManager/Dashboard";
import ProductManagement from "./pages/StoreManager/ProductManagement";
import RequestReview from "./pages/HOD/RequestReview";
import ApproveRequests from "./pages/HOD/ApproveRequests";
import { AuthProvider } from "contexts/AuthContext";

// MUI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

// ProtectedRoute logic (from second app)
interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("store_manager" | "hod" | "admin")[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
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
                <PrivateRoute allowedRoles={["store_manager"]}>
                  <DashboardLayout>
                    <ProductManagement />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/requests"
              element={
                <PrivateRoute allowedRoles={["hod"]}>
                  <DashboardLayout>
                    <RequestReview />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/approve-requests"
              element={
                <PrivateRoute allowedRoles={["hod"]}>
                  <DashboardLayout>
                    <ApproveRequests />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            {/* Redirect unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
