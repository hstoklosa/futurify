import { queryOptions, useQuery } from "@tanstack/react-query";

import { QueryConfig } from "@lib/react-query";
import { api } from "@lib/api-client";

import { Job } from "@/types/api";
import { jobQueryKeys } from "./job-query-keys";

const getJobs = async (boardId: string): Promise<{ data: Job[] }> => {
  return api.get(`/jobs/board/${boardId}`);
};

export const getJobsOptions = (boardId: string) => {
  return queryOptions({
    queryKey: jobQueryKeys.list(boardId),
    queryFn: () => getJobs(boardId),
    meta: {
      showToast: true,
      toastMessage: "Failed to load job applications. Please try again.",
    },
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
