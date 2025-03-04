import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { QueryConfig } from "@lib/react-query";

import { Job } from "@/types/api";
import { jobQueryKeys } from "./job-query-keys";

const getJob = (jobId: number): Promise<{ data: Job }> => {
  return api.get(`/jobs/${jobId}`);
};

export const getJobOptions = (jobId: number) => {
  return queryOptions({
    queryKey: jobQueryKeys.detail(jobId),
    queryFn: () => getJob(jobId),
    meta: {
      showToast: true,
      toastMessage: "Failed to load job application details. Please try again.",
    },
  });
};

type UseGetJobOptions = {
  jobId: number;
  queryConfig?: QueryConfig<typeof getJobOptions>;
};

export const useGetJob = ({ jobId, queryConfig }: UseGetJobOptions) => {
  return useQuery({
    ...getJobOptions(jobId),
    ...queryConfig,
  });
};
