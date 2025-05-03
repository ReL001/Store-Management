// src/lib/react-query/hooks/useVendors.ts
import { useVendorsQuery } from "../vendorQueries";

export const useVendors = (search?: string) => {
  return useVendorsQuery(search);
};