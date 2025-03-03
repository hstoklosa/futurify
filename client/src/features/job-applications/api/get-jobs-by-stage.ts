import { queryOptions, useQuery } from "@tanstack/react-query";

import { QueryConfig } from "@lib/react-query";
import { api } from "@lib/api-client";

import { Job } from "@/types/api";
import { jobQueryKeys } from "./job-query-keys";

// Function to get jobs by stage
const getJobsByStage = async (stageId: string): Promise<{ data: Job[] }> => {
  return api.get(`/jobs/stage/${stageId}`);
};

// Query options for getting jobs by stage
export const getJobsByStageOptions = (stageId: string) => {
  return queryOptions({
    queryKey: jobQueryKeys.listByStage(stageId),
    queryFn: () => getJobsByStage(stageId),
  });
};

// Interface for the hook options
interface UseJobsByStageOptions {
  stageId: string;
  queryConfig?: QueryConfig<typeof getJobsByStageOptions>;
}

// Hook for getting jobs by stage
export const useJobsByStage = ({ stageId, queryConfig }: UseJobsByStageOptions) => {
  return useQuery({
    ...getJobsByStageOptions(stageId),
    ...queryConfig,
  });
};
