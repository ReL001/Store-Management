// src/react-query/hooks/useRecentOrders.ts
import { useRecentOrdersQuery } from "../orderQueries";

export const useRecentOrders = () => {
  return useRecentOrdersQuery();
};
