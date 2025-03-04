import { useQuery } from "@tanstack/react-query";
import { api } from "@lib/api-client";
import { QueryConfig } from "@lib/react-query";

const getTodayApplicationsCount = async (): Promise<{ data: number }> => {
  return api.get("/jobs/today/count");
};

export const useGetTodayApplicationsCount = (
  config?: Partial<QueryConfig<typeof getTodayApplicationsCount>>
) => {
  return useQuery({
    queryKey: ["jobs", "today-count"],
    queryFn: getTodayApplicationsCount,
    ...config,
  });
};
