import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { QueryConfig } from "@lib/react-query";

import { JobTimelineEvent } from "@/types/api";
import { timelineQueryKeys } from "./timeline-query-keys";

type JobTimelineResponse = {
  data: JobTimelineEvent[];
};

/**
 * Fetch timeline events for a specific job
 */
const getJobTimeline = (jobId: number): Promise<JobTimelineResponse> => {
  return api.get(`/jobs/${jobId}/timeline`);
};

/**
 * Query options for fetching job timeline events
 */
export const getJobTimelineOptions = (jobId: number) => {
  return queryOptions({
    queryKey: timelineQueryKeys.list(jobId),
    queryFn: () => getJobTimeline(jobId),
  });
};

type UseGetJobTimelineOptions = {
  jobId: number;
  queryConfig?: QueryConfig<typeof getJobTimelineOptions>;
};

/**
 * React query hook for fetching job timeline events
 */
export const useGetJobTimeline = ({
  jobId,
  queryConfig,
}: UseGetJobTimelineOptions) => {
  return useQuery({
    ...getJobTimelineOptions(jobId),
    ...queryConfig,
  });
};
