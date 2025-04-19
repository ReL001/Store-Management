// src/react-query/hooks/useLogin.ts
import { useLoginMutation } from "../authQueries";

export const useLogin = () => {
  return useLoginMutation();
};
