// src/react-query/orderQueries.ts
import { useQuery, UseQueryResult, useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { Order, OrdersData } from "types/order";
import { queryClient } from "./queryClient"; // Import your existing instance
import { apiClient } from "./apiClient"; // Added import

interface OrderItem {
  name: string;
  description: string;
  quantity: number;
  price?: number;
  _id: string;
}

interface ApiResponse {
  statusCode: number;
  data: OrdersData;
  message: string;
  success: boolean;
}

// For recent orders (different structure than regular orders)
interface RecentOrdersResponse {
  statusCode: number;
  data: Order[]; // Direct array of orders
  message: string;
  success: boolean;
}

interface CreateOrderPayload {
  ginDetails: {
    ginNumber: string;
    date: string | Date;
    department: string;
    billNumber: string;
  };
  vendorDetails: {
    name: string;
    contactNumber: string;
    gstin: string;
    address: string;
  };
  items: Array<{
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
  }>;
}

function validateOrdersResponse(response: unknown): OrdersData {
  // Check if response is an object
  if (!response || typeof response !== "object") {
    console.warn("Invalid API response structure", response);
    return { orders: [], totalOrders: 0 };
  }

  // Safely access the data property
  const responseData = (response as { data?: unknown }).data;

  // Check if data exists and is an object
  if (!responseData || typeof responseData !== "object") {
    console.warn("Invalid data structure in API response", response);
    return { orders: [], totalOrders: 0 };
  }

  // Extract orders and totalOrders with proper type checking
  const orders = (responseData as { orders?: unknown }).orders;
  const totalOrders = (responseData as { totalOrders?: unknown }).totalOrders;

  // Validate orders is an array (or default to empty array)
  const validatedOrders = Array.isArray(orders) ? orders : [];

  // Validate totalOrders is a number (or default to 0)
  const validatedTotal = typeof totalOrders === "number" ? totalOrders : 0;

  return {
    orders: validatedOrders as Order[], // Safe cast after validation
    totalOrders: validatedTotal,
  };
}

const fetchRecentOrders = async (): Promise<Order[]> => {
  try {
    const response = await apiClient.get("/orders/recent");
    return response.data.data; // Backend wraps in ApiResponse
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

export const useRecentOrdersQuery = (): UseQueryResult<Order[], Error> => {
  return useQuery({
    queryKey: ["recentOrders"],
    queryFn: fetchRecentOrders,
  });
};

const fetchOrders = async (status?: string): Promise<OrdersData> => {
  try {
    const url = status ? `/orders?status=${status}` : "/orders";
    const response = await apiClient.get(url);
    return response.data.data; // Backend wraps in ApiResponse
  } catch (error) {
    console.error("Fetch error:", error);
    return { orders: [], totalOrders: 0 };
  }
};

export const useGetOrdersQuery = (
  status?: string
): UseQueryResult<OrdersData, Error> => {
  return useQuery({
    queryKey: ["orders", status],
    queryFn: () => fetchOrders(status),
    staleTime: 60000,
    refetchOnMount: true,
  });
};

const createOrder = async (orderData: CreateOrderPayload): Promise<Order> => {
  const response = await apiClient.post("/orders/create", orderData);
  return response.data.data; // Backend wraps in ApiResponse, return the Order
};

export const useCreateOrderMutation = (): UseMutationResult<
  Order,
  Error,
  CreateOrderPayload
> => {
  const queryClient = useQueryClient(); // Use hook to access the client

  return useMutation({
    mutationFn: createOrder, // Your existing createOrder function
    onMutate: async (newOrder) => {
      // Cancel ongoing orders queries
      await queryClient.cancelQueries({ queryKey: ["orders"] });

      // Snapshot previous data
      const previousOrders = queryClient.getQueryData<OrdersData>(["orders"]);

      // Optimistically update cache
      if (previousOrders) {
        queryClient.setQueryData(["orders"], {
          ...previousOrders,
          orders: [newOrder as any, ...previousOrders.orders], // Temporary cast
          totalOrders: previousOrders.totalOrders + 1,
        });
      }

      return { previousOrders };
    },
    onError: (err, _, context) => {
      // Rollback on error
      if (context?.previousOrders) {
        queryClient.setQueryData(["orders"], context.previousOrders);
      }
    },
    onSettled: () => {
      // Invalidate all orders queries to refetch
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

const deleteOrder = async (orderId: string): Promise<Order> => {
  const response = await apiClient.delete(`/orders/delete/${orderId}`);
  return response.data.data; // Backend wraps in ApiResponse, return the Order
};

export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient(); // Ensure queryClient is available
  return useMutation<Order, Error, string>({
    mutationFn: deleteOrder,
    onSuccess: () => {
      // Invalidate the orders query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
