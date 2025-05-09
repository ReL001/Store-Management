export interface User {
  id: string;
  email: string;
  role: "manager" | "hod";
  fullName: string;
  department: string;
  avatar?: string; // Optional avatar URL for profile image
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
  status: "pending" | "approved" | "rejected" | "changes_requested";
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
