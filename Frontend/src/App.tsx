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
import VendorManagement from "./pages/StoreManager/VendorManagement";
import RequestReview from "./pages/HOD/RequestReview";
import ApproveRequests from "./pages/HOD/ApproveRequests";
import { AuthProvider } from "contexts/AuthContext";
import OrderManagement from "./pages/StoreManager/OrderManagement";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // <-- Required for styling

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can log error info here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, textAlign: "center" }}>
          <h2>Something went wrong.</h2>
          <pre style={{ color: "red" }}>{this.state.error?.toString()}</pre>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  const isAuthenticated = !!localStorage.getItem("accessToken"); // Changed "token" to "accessToken"
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
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
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
              path="/orders"
              element={
                <PrivateRoute allowedRoles={["manager"]}>
                  <DashboardLayout>
                    <OrderManagement />
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

            {/* <Route
              path="/approve-requests"
              element={
                <PrivateRoute allowedRoles={["hod"]}>
                  <DashboardLayout>
                    <ApproveRequests />
                  </DashboardLayout>
                </PrivateRoute>
              }
            /> */}

            {/* Redirect unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          {/* Add this at the root level - only once in your app */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
