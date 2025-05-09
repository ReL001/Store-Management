// src/react-query/orderMutations.ts
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { Order } from "../../types/order";

interface OrderActionParams {
  orderId: string;
  action: "approve" | "reject" | "request_changes" | "quotation_requested";
  message?: string;
}

export const useOrderActionMutation = (): UseMutationResult<
  Order,
  Error,
  OrderActionParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, action, message }: OrderActionParams) => {
      const { data } = await apiClient.patch(`/orders/handleOrder/${orderId}`, {
        action,
        message,
      });
      return data;
    },
    onMutate: async ({ orderId, action, message }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["orders"] });

      // Snapshot the previous value
      const previousOrders = queryClient.getQueryData<{ orders: Order[] }>([
        "orders",
      ]);

      // Optimistically update to the new value
      if (previousOrders) {
        queryClient.setQueryData(["orders"], {
          ...previousOrders,
          orders: previousOrders.orders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status:
                    action === "approve"
                      ? "approved"
                      : action === "reject"
                      ? "rejected"
                      : action === "quotation_requested"
                      ? "quotation_requested"
                      : "changes_requested",
                  approvedBy: "optimistic-update", // Will be replaced by real data
                  ...(action === "request_changes" && {
                    requestedChanges: message,
                  }),
                }
              : order
          ),
        });
      }

      return { previousOrders };
    },
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData<{ orders: Order[] }>(["orders"], (oldData) => {
        if (!oldData) return oldData;
        return {
          orders: oldData.orders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          ),
        };
      });
    },
    onError: (err, variables, context) => {
      console.log("Error");
      // Rollback on error
      if (context?.previousOrders) {
        queryClient.setQueryData(["orders"], context.previousOrders);
      }
    },
    onSettled: () => {
      // Always refetch after error or success

      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
