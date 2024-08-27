import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { MutationConfig } from "@lib/react-query";
import { RegisterInput } from "@types/auth";
import { User } from "@types/api";
import { USER_KEY } from "@utils/constants";

const register = async (data: RegisterInput): Promise<User> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const useRegister = (
  options?: Omit<MutationConfig<typeof register>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  const setUser = React.useCallback(
    (data: User) => queryClient.setQueryData(USER_KEY, data),
    [queryClient]
  );

  return useMutation({
    mutationFn: register,
    ...options,
    onSuccess: (data, ...rest) => {
      setUser(data);
      options?.onSuccess?.(data, ...rest);
    },
  });
};
