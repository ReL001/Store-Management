// src/lib/react-query/vendorQueries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
const fetchVendors = async (
  searchTerm?: string,
  page?: number,
  limit?: number
): Promise<VendorsData> => {
  try {
    // Create URL with all parameters
    const url = new URL("http://localhost:4000/api/vendors");

    // Add search term if provided
    if (searchTerm) {
      url.searchParams.append("search", searchTerm);
    }

    // Add pagination parameters
    if (page !== undefined) {
      url.searchParams.append("page", page.toString());
    }

    if (limit !== undefined) {
      url.searchParams.append("limit", limit.toString());
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch vendors");
    }

    const result: ApiResponse<VendorsData> = await response.json();
    console.log(result.data.vendors);
    return result.data;
  } catch (error) {
    console.error("Fetch error:", error);
    return { vendors: [], totalVendors: 0 };
  }
};
export const useVendorsQuery = (
  searchTerm?: string,
  page?: number,
  limit?: number
) => {
  return useQuery({
    queryKey: ["vendors", searchTerm, page, limit],
    queryFn: () => fetchVendors(searchTerm, page, limit),
    staleTime: 60000, // 1 minute
  });
};

// Get vendor by ID
const fetchVendorById = async (id: string): Promise<Vendor | null> => {
  if (!id) return null;

  try {
    const response = await fetch(`http://localhost:4000/api/vendors/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch vendor");
    }

    const result: ApiResponse<Vendor> = await response.json();
    return result.data;
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
export const useCreateVendorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      vendorData: Omit<
        Vendor,
        "_id" | "createdAt" | "updatedAt" | "previousOrders"
      >
    ) => {
      const response = await fetch("http://localhost:4000/api/vendors/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(vendorData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create vendor");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
};

// Update vendor
export const useUpdateVendorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      vendorData,
    }: {
      id: string;
      vendorData: Partial<
        Omit<Vendor, "_id" | "createdAt" | "updatedAt" | "previousOrders">
      >;
    }) => {
      const response = await fetch(`http://localhost:4000/api/vendors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(vendorData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update vendor");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor", variables.id] });
    },
  });
};

// Delete vendor
export const useDeleteVendorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`http://localhost:4000/api/vendors/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete vendor");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
};
