import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@lib/api-client";
import { MutationConfig } from "@lib/react-query";

const getDailyGoal = async (): Promise<{ data: number }> => {
  return api.get("/users/daily-goal");
};

export const useGetDailyGoal = () => {
  return useQuery({
    queryKey: ["user", "daily-goal"],
    queryFn: getDailyGoal,
  });
};

const updateDailyGoal = async (goal: number): Promise<{ data: number }> => {
  return api.patch("/users/daily-goal", {
    dailyApplicationGoal: goal,
  });
};

export const useUpdateDailyGoal = (
  config: Omit<MutationConfig<typeof updateDailyGoal>, "mutationFn"> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDailyGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "daily-goal"] });
    },
    ...config,
  });
};
