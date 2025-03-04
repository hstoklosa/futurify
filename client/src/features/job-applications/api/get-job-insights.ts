import { useQuery } from "@tanstack/react-query";
import { api } from "@lib/api-client";
import { JobInsightsData } from "../types";

export type JobInsightsParams = {
  jobId: number;
};

export const getJobInsights = async ({
  jobId,
}: JobInsightsParams): Promise<{ data: JobInsightsData }> => {
  return api.get(`/jobs/${jobId}/insights`);
};

export const useGetJobInsights = ({ jobId }: JobInsightsParams) => {
  return useQuery({
    queryKey: ["job-insights", jobId],
    queryFn: () => getJobInsights({ jobId }),
    enabled: !!jobId,
  });
};
