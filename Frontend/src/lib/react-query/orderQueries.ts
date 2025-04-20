// src/react-query/orderQueries.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";

// Define the structure of an item in the order
interface OrderItem {
  name: string;
  description: string;
  quantity: number;
  price: number;
}

// Define the structure of the order response
export interface Order {
  _id: string;
  items: OrderItem[];
  vendor: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// API call to get recent orders
const fetchRecentOrders = async (): Promise<Order[]> => {
  const response = await fetch("http://localhost:4000/api/orders/recent", {
    method: "GET",
    credentials: "include", // include cookies if auth is used
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch recent orders");
  }

  const result = await response.json();
  console.log(result.data);
  return result.data;
};

// Hook to use in components
export const useRecentOrdersQuery = (): UseQueryResult<Order[], Error> => {
  return useQuery({
    queryKey: ["recentOrders"],
    queryFn: fetchRecentOrders,
  });
};
