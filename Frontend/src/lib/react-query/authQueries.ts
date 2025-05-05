// src/react-query/authQueries.ts
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { toast } from "react-toastify";

// Define the shape of login request data
interface LoginData {
  email: string;
  password: string;
}

// Define the shape of the response data from the backend
interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}

// Login mutation hook

export const useLoginMutation = (): UseMutationResult<
  LoginResponse,
  Error,
  LoginData
> => {
  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiClient.post("/users/login", data);
      return response.data; // Axios automatically parses JSON
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};

// Add this mutation for token refresh
export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/users/refresh-token");
      return response.data.accessToken;
    },
    onSuccess: (token) => {
      localStorage.setItem("accessToken", token);
    },
  });
};
