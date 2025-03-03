import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@lib/api-client";
import { jobQueryKeys } from "./job-query-keys";

export function useUpdateJobPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: any) => {
      const { jobId, data } = params;
      return api.patch(`/jobs/${jobId}/position`, data);
    },
    onSuccess: (response: any, variables: any) => {
      const responseJob = response.data;

      // Update the job detail cache
      queryClient.setQueryData(jobQueryKeys.detail(responseJob.id), responseJob);

      // Invalidate the jobs list for the board if boardId is provided
      if (variables.boardId) {
        queryClient.invalidateQueries({
          queryKey: jobQueryKeys.list(variables.boardId),
        });
      }

      // Invalidate the jobs list for the affected stages
      if (variables.data && variables.data.stageId) {
        queryClient.invalidateQueries({
          queryKey: jobQueryKeys.listByStage(variables.data.stageId.toString()),
        });
      }

      // If we have the previous stage ID in the job data, invalidate that too
      const previousStageId = responseJob.stageId;
      if (
        previousStageId &&
        variables.data &&
        previousStageId !== variables.data.stageId
      ) {
        queryClient.invalidateQueries({
          queryKey: jobQueryKeys.listByStage(previousStageId.toString()),
        });
      }
    },
  });
}
