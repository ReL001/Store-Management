import axios from "axios";
import { toast } from "react-toastify";

// Automatically determine which API to use based on current environment
const API_URL = process.env.NODE_ENV === "production" 
  ? "https://store-management-ie0y.onrender.com/api"  // Production backend
  : "http://localhost:4000/api";                      // Local development

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // For cookies if using httpOnly tokens
});

// Request interceptor (attach token)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // Use your token key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear storage and trigger logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      toast.error("Session expired. Please log in again.");

      // Optional: Redirect to login (avoid React state issues)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
