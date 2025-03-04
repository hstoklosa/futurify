import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { MutationConfig } from "@lib/react-query";

import { RegisterInput } from "@/types/auth";
import { User } from "@/types/api";
import { USER_KEY } from "@utils/constants";

const register = async (data: RegisterInput): Promise<{ data: User }> => {
  return api.post("/auth/register", data);
};

export const useRegister = ({
  onSuccess,
  ...rest
}: Omit<MutationConfig<typeof register>, "mutationFn">) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (data, ...args) => {
      queryClient.setQueryData(USER_KEY, () => ({ data: data.data }));
      onSuccess && onSuccess(data, ...args);
    },
    meta: {
      showToast: true,
      toastMessage: "Registration failed. Please try again.",
    },
    ...rest,
  });
};
