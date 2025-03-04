import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@lib/api-client";
import { jobQueryKeys } from "./job-query-keys";
import { Job } from "@/types/api";

export function useUpdateJobPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      jobId: number;
      boardId?: string;
      data: {
        stageId: number;
        position: number;
      };
    }) => {
      const { jobId, data } = params;
      return api.patch(`/jobs/${jobId}/position`, data);
    },
    // Optimistically update the cache for instant UI updates
    onMutate: async (variables) => {
      const { jobId, boardId, data } = variables;

      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: jobQueryKeys.list(boardId || ""),
      });

      // Get the current job from the cache
      const prevJob = queryClient.getQueryData<Job>(jobQueryKeys.detail(jobId));

      // Get the current jobs list from the cache
      const prevJobsList = boardId
        ? queryClient.getQueryData<{ data: Job[] }>(jobQueryKeys.list(boardId))
        : null;

      // Create an optimistic job update
      const optimisticJob = {
        ...(prevJob || {}),
        id: jobId,
        stageId: data.stageId,
        position: data.position,
      } as Job;

      // Update the job detail in the cache
      queryClient.setQueryData(jobQueryKeys.detail(jobId), optimisticJob);

      // Update the jobs list in the cache if we have it
      if (prevJobsList && boardId) {
        const updatedJobs = prevJobsList.data.map((job) =>
          job.id === jobId ? optimisticJob : job
        );

        queryClient.setQueryData(jobQueryKeys.list(boardId), {
          data: updatedJobs,
        });
      }

      // Return previous values for rollback
      return { prevJob, prevJobsList, boardId };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, roll back the optimistic update
      if (context?.prevJob) {
        queryClient.setQueryData(
          jobQueryKeys.detail(variables.jobId),
          context.prevJob
        );
      }

      if (context?.prevJobsList && context.boardId) {
        queryClient.setQueryData(
          jobQueryKeys.list(context.boardId),
          context.prevJobsList
        );
      }
    },
    onSettled: (response, error, variables) => {
      // Always refetch after error or success to make sure the server state
      // is eventually reflected in the UI
      if (variables.boardId) {
        queryClient.invalidateQueries({
          queryKey: jobQueryKeys.list(variables.boardId),
        });
      }

      // Invalidate the affected stages
      if (variables.data.stageId) {
        queryClient.invalidateQueries({
          queryKey: jobQueryKeys.listByStage(variables.data.stageId.toString()),
        });
      }

      // If we had a job in the cache before, and its stageId is different,
      // invalidate the previous stage too
      const job = queryClient.getQueryData<Job>(
        jobQueryKeys.detail(variables.jobId)
      );
      const previousStageId = job?.stageId;
      if (previousStageId && previousStageId !== variables.data.stageId) {
        queryClient.invalidateQueries({
          queryKey: jobQueryKeys.listByStage(previousStageId.toString()),
        });
      }
    },
  });
}
