// src/react-query/authQueries.ts
import { useMutation, UseMutationResult } from "@tanstack/react-query";

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
    username: string;
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
    mutationFn: async (data: LoginData): Promise<LoginResponse> => {
      const response = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      return response.json();
    },
  });
};
