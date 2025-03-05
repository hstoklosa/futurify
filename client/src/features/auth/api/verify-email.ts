import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { MutationConfig } from "@lib/react-query";

import { User } from "@/types/api";
import { USER_KEY } from "@utils/constants";

const verifyEmail = (token: string): Promise<void> => {
  return api.get(`/auth/activate-account?token=${token}`);
};

export const useVerifyEmail = ({
  onSuccess,
  ...rest
}: Omit<MutationConfig<typeof verifyEmail>, "mutationFn">) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data, ...args) => {
      queryClient.setQueryData(USER_KEY, (prev: { data: User }) => ({
        data: { ...prev.data, enabled: true },
      }));

      onSuccess && onSuccess(data, ...args);
    },
    meta: {
      showToast: true,
      toastMessage:
        "Email verification failed. The link may be expired or invalid.",
    },
    ...rest,
  });
};
