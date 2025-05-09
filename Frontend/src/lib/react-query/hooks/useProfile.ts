import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { toast } from "react-toastify";
import { User } from "../../../types";

interface ProfileUpdateData {
  fullName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  department?: string;
}

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await apiClient.get("/users/profile");
      return response.data.data;
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      const response = await apiClient.put("/users/profile/update", data);
      return response.data;
    },
    onSuccess: (data) => {
      // Update the user in localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...data.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      // Show success message
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      // Show error message
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
};