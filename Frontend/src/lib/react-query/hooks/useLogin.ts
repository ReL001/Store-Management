import { useAuth } from "contexts/AuthContext";
import { useLoginMutation } from "../authQueries";

export const useLogin = () => {
  const { login } = useAuth();
  const mutation = useLoginMutation();

  return {
    ...mutation,
    mutate: (
      data: Parameters<typeof mutation.mutate>[0],
      options?: Parameters<typeof mutation.mutate>[1]
    ) => {
      mutation.mutate(data, {
        ...options,
        onSuccess: (response, ...args) => {
          // Sync with AuthContext
          login(response.user, response.accessToken);

          // Call any additional onSuccess from options
          if (options?.onSuccess) {
            options.onSuccess(response, ...args);
          }
        },
        onError: (error, ...args) => {
          // Default toast error is already handled inside useLoginMutation
          // Call any additional onError from options
          if (options?.onError) {
            options.onError(error, ...args);
          }
        },
      });
    },
  };
};
