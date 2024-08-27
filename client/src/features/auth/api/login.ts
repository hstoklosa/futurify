import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { MutationConfig } from "@lib/react-query";
import { LoginInput } from "@types/auth";
import { User } from "@types/api";
import { USER_KEY } from "@utils/constants";

const login = async (data: LoginInput): Promise<User> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const useLogin = (
  options?: Omit<MutationConfig<typeof login>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  const setUser = React.useCallback(
    (data: User) => queryClient.setQueryData(USER_KEY, data),
    [queryClient]
  );

  return useMutation({
    mutationFn: login,
    ...options,
    onSuccess: (data) => {
      setUser(data);
    },
  });
};
