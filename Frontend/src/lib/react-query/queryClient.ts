// src/react-query/queryClient.ts
import { QueryClient, DefaultOptions } from "@tanstack/react-query";

// Define default options (optional but useful for IntelliSense)
const defaultQueryOptions: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: 1,
  },
};

// Create a QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});
