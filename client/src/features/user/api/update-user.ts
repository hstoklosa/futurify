import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@lib/api-client";
import { MutationConfig } from "@lib/react-query";
import { User } from "@/types/api";
import { USER_KEY } from "@utils/constants";

export type UpdateUserInput = {
  firstName?: string;
  lastName?: string;
  password?: string;
  dailyApplicationGoal?: number;
};

const updateUser = async (data: UpdateUserInput): Promise<{ data: User }> => {
  return api.patch("/users/profile", data);
};

export const useUpdateUser = (
  config: Omit<MutationConfig<typeof updateUser>, "mutationFn"> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEY });
      queryClient.invalidateQueries({ queryKey: ["user", "daily-goal"] });
    },
    meta: {
      showToast: true,
      toastMessage: "Profile updated successfully",
    },
    ...config,
  });
};
