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
import ManagerDashboard from "./pages/StoreManager/Dashboard";
import HodDashboard from "./pages/HOD/Dashboard";
import ProductManagement from "./pages/StoreManager/ProductManagement";
import VendorManagement from "./pages/StoreManager/VendorManagement";
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

// ProtectedRoute logic
interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("manager" | "hod" | "assistant")[];
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

// Role-based Dashboard component
const DashboardPage: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.role === "manager") {
    return <ManagerDashboard />;
  }

  if (user.role === "hod") {
    return <HodDashboard />;
  }

  return <div>Unauthorized or unknown role</div>;
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
                <PrivateRoute allowedRoles={["manager", "hod"]}>
                  <DashboardLayout>
                    <DashboardPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/products"
              element={
                <PrivateRoute allowedRoles={["manager"]}>
                  <DashboardLayout>
                    <ProductManagement />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/vendors"
              element={
                <PrivateRoute allowedRoles={["manager"]}>
                  <DashboardLayout>
                    <VendorManagement />
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
