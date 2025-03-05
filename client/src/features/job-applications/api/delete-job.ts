import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@lib/api-client";
import { jobQueryKeys } from "./job-query-keys";

type DeleteJobVariables = {
  jobId: number;
};

export const deleteJob = ({ jobId }: DeleteJobVariables) => {
  return api.delete(`/jobs/${jobId}`);
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobQueryKeys.all });
    },
  });
};
