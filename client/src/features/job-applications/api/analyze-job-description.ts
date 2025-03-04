import { useMutation } from "@tanstack/react-query";
import { api } from "@lib/api-client";
import { JobInsightsData } from "../types";

export interface JobDescriptionAnalysisParams {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
}

export const analyzeJobDescription = async (
  data: JobDescriptionAnalysisParams
): Promise<{ data: JobInsightsData }> => {
  return api.post(`/jobs/analyze`, data);
};

export const useAnalyzeJobDescription = () => {
  return useMutation({
    mutationFn: analyzeJobDescription,
  });
};
