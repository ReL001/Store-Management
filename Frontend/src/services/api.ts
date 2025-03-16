import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5000/api';

// Define interfaces for API responses
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Define interfaces for different data types
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'store_manager' | 'hod';
  department?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  status: 'available' | 'out_of_stock';
}

interface Request {
  _id: string;
  userId: string;
  productId: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

interface Vendor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  products: string[];
  rating: number;
  totalOrders: number;
  status: 'active' | 'inactive';
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string, role: string) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', { email, password, role }),
  register: (userData: Partial<User>) => 
    api.post<ApiResponse<User>>('/auth/register', userData),
  getMe: () => 
    api.get<ApiResponse<User>>('/auth/me'),
};

// Products API
export const productsAPI = {
  getAll: () => 
    api.get<ApiResponse<Product[]>>('/products'),
  getOne: (id: string) => 
    api.get<ApiResponse<Product>>(`/products/${id}`),
  create: (data: Partial<Product>) => 
    api.post<ApiResponse<Product>>('/products', data),
  update: (id: string, data: Partial<Product>) => 
    api.put<ApiResponse<Product>>(`/products/${id}`, data),
  delete: (id: string) => 
    api.delete<ApiResponse<void>>(`/products/${id}`),
  updateStatus: (id: string, status: Product['status']) =>
    api.patch<ApiResponse<Product>>(`/products/${id}/status`, { status }),
};

// Requests API
export const requestsAPI = {
  getAll: () => 
    api.get<ApiResponse<Request[]>>('/requests'),
  getOne: (id: string) => 
    api.get<ApiResponse<Request>>(`/requests/${id}`),
  create: (data: Partial<Request>) => 
    api.post<ApiResponse<Request>>('/requests', data),
  update: (id: string, data: Partial<Request>) => 
    api.put<ApiResponse<Request>>(`/requests/${id}`, data),
  delete: (id: string) => 
    api.delete<ApiResponse<void>>(`/requests/${id}`),
  updateStatus: (id: string, status: Request['status']) =>
    api.patch<ApiResponse<Request>>(`/requests/${id}/status`, { status }),
};

// Vendors API
export const vendorsAPI = {
  getAll: () => 
    api.get<ApiResponse<Vendor[]>>('/vendors'),
  getOne: (id: string) => 
    api.get<ApiResponse<Vendor>>(`/vendors/${id}`),
  create: (data: Partial<Vendor>) => 
    api.post<ApiResponse<Vendor>>('/vendors', data),
  update: (id: string, data: Partial<Vendor>) => 
    api.put<ApiResponse<Vendor>>(`/vendors/${id}`, data),
  delete: (id: string) => 
    api.delete<ApiResponse<void>>(`/vendors/${id}`),
  updateStatus: (id: string, status: Vendor['status']) =>
    api.patch<ApiResponse<Vendor>>(`/vendors/${id}/status`, { status }),
  updateRating: (id: string, rating: number) =>
    api.patch<ApiResponse<Vendor>>(`/vendors/${id}/rating`, { rating }),
};

// Users API
export const usersAPI = {
  getAll: () => 
    api.get<ApiResponse<User[]>>('/users'),
  getOne: (id: string) => 
    api.get<ApiResponse<User>>(`/users/${id}`),
  update: (id: string, data: Partial<User>) => 
    api.put<ApiResponse<User>>(`/users/${id}`, data),
  delete: (id: string) => 
    api.delete<ApiResponse<void>>(`/users/${id}`),
};

export default api; 