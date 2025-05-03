// src/react-query/hooks/useGetOrders.ts
import { useGetOrdersQuery } from "../orderQueries";

export const useGetOrders = (status?: string) => {
  return useGetOrdersQuery(status);
};
