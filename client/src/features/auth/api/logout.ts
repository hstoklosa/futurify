import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { MutationConfig } from "@lib/react-query";
import { User } from "@types/api";
import { USER_KEY } from "@utils/constants";

const logout = (): Promise<unknown> => {
  return api.post("/auth/logout");
};

export const useLogout = (
  options?: Omit<MutationConfig<typeof logout>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  const setUser = React.useCallback(
    (data: User | null) => queryClient.setQueryData(USER_KEY, data),
    [queryClient]
  );

  return useMutation({
    mutationFn: logout,
    ...options,
    onSuccess: () => {
      setUser(null);
    },
  });
};
