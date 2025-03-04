import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { MutationConfig } from "@lib/react-query";

import { LoginInput } from "@/types/auth";
import { User } from "@/types/api";
import { USER_KEY } from "@utils/constants";

const login = async (data: LoginInput): Promise<{ data: User }> => {
  return api.post("/auth/login", data);
};

export const useLogin = ({
  onSuccess,
  ...rest
}: Omit<MutationConfig<typeof login>, "mutationFn">) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data, ...args) => {
      queryClient.setQueryData(USER_KEY, () => ({ data: data.data }));
      onSuccess && onSuccess(data, ...args);
    },
    meta: {
      showToast: true,
      toastMessage: "Invalid email or password",
    },
    ...rest,
  });
};
