// src/react-query/hooks/useCreateOrder.ts
import { useCreateOrderMutation } from "../orderQueries";

export const useCreateOrder = () => {
  return useCreateOrderMutation();
};
