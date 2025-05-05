// src/lib/react-query/hooks/useVendors.ts
import { useVendorsQuery } from "../vendorQueries";

export const useVendors = (
  searchTerm?: string,
  page?: number,
  limit?: number
) => {
  return useVendorsQuery(searchTerm, page, limit);
};
