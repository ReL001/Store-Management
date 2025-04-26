// src/react-query/orderQueries.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface OrderItem {
  name: string;
  description: string;
  quantity: number;
  price?: number;
  _id: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  status: string;
  createdBy: string;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface OrdersData {
  orders: Order[];
  totalOrders: number;
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
    const response = await fetch("http://localhost:4000/api/orders/recent", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: RecentOrdersResponse = await response.json();

    // Recent orders endpoint returns array directly in data property
    return Array.isArray(result.data) ? result.data : [];
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
    const url = status
      ? `http://localhost:4000/api/orders?status=${status}`
      : `http://localhost:4000/api/orders`;

    console.log("Making request to:", url); // Debug 1: URL verification

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch orders");
    }

    const result: ApiResponse = await response.json();
    console.log("Raw API response:", result); // Debug 2: Raw response
    // return validateOrdersResponse(result.data);
    return result.data;
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
