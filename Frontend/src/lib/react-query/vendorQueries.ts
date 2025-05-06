// src/lib/react-query/vendorQueries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export interface Vendor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
  additionalDetails?: string;
  previousOrders: string[];
  createdAt: string;
  updatedAt: string;
}

interface VendorsData {
  vendors: Vendor[];
  totalVendors: number;
}

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

// Get all vendors
const fetchVendors = async (search?: string): Promise<VendorsData> => {
  try {
    const url = search 
      ? `/vendors?search=${search}`
      : `/vendors`;

    const response = await apiClient.get(url);
    return response.data.data; // Backend wraps in ApiResponse
  } catch (error) {
    console.error("Fetch error:", error);
    return { vendors: [], totalVendors: 0 };
  }
};

export const useVendorsQuery = (search?: string) => {
  return useQuery({
    queryKey: ["vendors", search],
    queryFn: () => fetchVendors(search),
    staleTime: 60000, // 1 minute
  });
};

// Get vendor by ID
const fetchVendorById = async (id: string): Promise<Vendor | null> => {
  if (!id) return null;
  
  try {
    const response = await apiClient.get(`/vendors/${id}`);
    return response.data.data; // Backend wraps in ApiResponse
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const useVendorByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["vendor", id],
    queryFn: () => fetchVendorById(id),
    enabled: !!id, // Only run if ID exists
  });
};

// Create vendor
const createVendorFn = async (vendorData: Omit<Vendor, "_id" | "createdAt" | "updatedAt" | "previousOrders">): Promise<Vendor> => {
  const response = await apiClient.post("/vendors/create", vendorData);
  return response.data.data; // Backend wraps in ApiResponse, return Vendor
};

export const useCreateVendorMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Vendor, Error, Omit<Vendor, "_id" | "createdAt" | "updatedAt" | "previousOrders">>({
    mutationFn: createVendorFn,
    onSuccess: () => {
      // Invalidate queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
};

// Update vendor
const updateVendorFn = async ({ 
  id, 
  vendorData 
}: { 
  id: string; 
  vendorData: Partial<Omit<Vendor, "_id" | "createdAt" | "updatedAt" | "previousOrders">> 
}): Promise<Vendor> => {
  const response = await apiClient.put(`/vendors/${id}`, vendorData);
  return response.data.data; // Backend wraps in ApiResponse, return Vendor
};

export const useUpdateVendorMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Vendor, Error, { id: string; vendorData: Partial<Omit<Vendor, "_id" | "createdAt" | "updatedAt" | "previousOrders">> }>({
    mutationFn: updateVendorFn,
    onSuccess: (_, variables) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor", variables.id] });
    },
  });
};

// Delete vendor
const deleteVendorFn = async (id: string): Promise<Vendor> => {
  const response = await apiClient.delete(`/vendors/${id}`);
  return response.data.data; // Backend wraps in ApiResponse, return Vendor
};

export const useDeleteVendorMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Vendor, Error, string>({
    mutationFn: deleteVendorFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
};