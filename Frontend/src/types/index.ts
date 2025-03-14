export interface User {
  id: string;
  email: string;
  role: 'store_manager' | 'hod';
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
}

export interface Request {
  id: string;
  productName: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  storeManager: string;
  date: string;
  comments?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
} 