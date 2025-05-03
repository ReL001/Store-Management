// src/lib/react-query/hooks/useDeleteOrder.ts
import { useDeleteOrderMutation } from "../orderQueries";

export const useDeleteOrder = () => {
  return useDeleteOrderMutation();
};
