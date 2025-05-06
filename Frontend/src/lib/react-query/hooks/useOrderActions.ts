// src/react-query/hooks/useOrderActions.ts
import { useOrderActionMutation } from "../orderMutations";

export const useOrderActions = () => {
  const mutation = useOrderActionMutation();

  const approveOrder = (orderId: string) => {
    return mutation.mutateAsync({ orderId, action: "approve" });
  };

  const rejectOrder = (orderId: string) => {
    return mutation.mutateAsync({ orderId, action: "reject" });
  };

  const requestChanges = (orderId: string, message: string) => {
    return mutation.mutateAsync({
      orderId,
      action: "request_changes",
      message,
    });
  };

  const quotationRequested = (orderId: string) => {
    return mutation.mutateAsync({
      orderId,
      action: "quotation_requested",
    });
  };

  return {
    approveOrder,
    rejectOrder,
    requestChanges,
    quotationRequested,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
