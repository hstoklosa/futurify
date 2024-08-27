import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { MutationConfig } from "@lib/react-query";
import { User } from "@types/api";
import { USER_KEY } from "@utils/constants";

const verifyEmail = (token: string): Promise<unknown> => {
  return api.get(`/auth/activate-account?token=${token}`);
};

export const useVerifyEmail = (
  options?: Omit<MutationConfig<verifyEmail>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  const setUser = React.useCallback(
    (data: User) => queryClient.setQueryData(USER_KEY, data),
    [queryClient]
  );

  return useMutation({
    mutationFn: verifyEmail,
    ...options,
    onSuccess: (data, ...rest) => {
      const previousUser = queryClient.getQueryData(USER_KEY);
      setUser({
        ...previousUser,
        enabled: true,
      });

      options?.onSuccess?.(data, ...rest);
    },
  });
};
