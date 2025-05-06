// hooks/useForwardOrder.ts

import { useMutation } from "@tanstack/react-query";
import { forwardOrder } from "../orderQueries";

export const useForwardOrderMutation = () => {
  return useMutation({
    mutationFn: forwardOrder,
  });
};
