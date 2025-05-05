// src/react-query/hooks/useGetOrders.ts
import { useGetOrdersQuery } from "../orderQueries";

export const useGetOrders = (
  status?: string,
  page?: number,
  limit?: number
) => {
  return useGetOrdersQuery(status, page, limit);
};
