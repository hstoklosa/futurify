import { queryOptions, useQuery } from "@tanstack/react-query";

import { QueryConfig } from "@lib/react-query";
import { api } from "@lib/api-client";

import { Job } from "@/types/api";
import { jobQueryKeys } from "./job-query-keys";

const getJobs = async (boardsId: string): Promise<{ data: Job[] }> => {
  return api.get(`/boards/${boardsId}/jobs`);
};

export const getJobsOptions = (boardId: string) => {
  return queryOptions({
    queryKey: jobQueryKeys.list(boardId),
    queryFn: () => getJobs(boardId),
  });
};

type UseJobsOptions = {
  boardId: string;
  queryConfig?: QueryConfig<typeof getJobsOptions>;
};

export const useJobs = ({ boardId, queryConfig }: UseJobsOptions) => {
  return useQuery({
    ...getJobsOptions(boardId),
    ...queryConfig,
  });
};
