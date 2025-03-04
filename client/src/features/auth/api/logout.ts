import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { MutationConfig } from "@lib/react-query";

import { USER_KEY } from "@utils/constants";

const logout = (): Promise<void> => {
  return api.post("/auth/logout");
};

export const useLogout = ({
  onSuccess,
  ...rest
}: Omit<MutationConfig<typeof logout>, "mutationFn">) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: (...args) => {
      queryClient.setQueryData(USER_KEY, () => ({ data: null }));
      onSuccess && onSuccess(...args);
    },
    meta: {
      showToast: true,
      toastMessage: "Failed to logout. Please try again.",
    },
    ...rest,
  });
};
