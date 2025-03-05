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

    // We handle optimistic updates in BoardView but also provide fallback here
    onMutate: async (variables) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: jobQueryKeys.list(variables.boardId!),
      });

      // Only attempt optimistic update if we haven't already done it in the component
      const currentJobs = queryClient.getQueryData<{ data: Job[] }>(
        jobQueryKeys.list(variables.boardId!)
      );

      if (!currentJobs) return { prevJobs: undefined };

      // Store the previous state for rollback in case of error
      const prevJobs = currentJobs;

      // Return context with the previous state
      return { prevJobs };
    },

    // If mutation fails, roll back to the previous state
    onError: (error, variables, context) => {
      console.error("Failed to update job position:", error);

      if (variables.boardId && context?.prevJobs) {
        // Immediately restore previous state on error
        queryClient.setQueryData(
          jobQueryKeys.list(variables.boardId),
          context.prevJobs
        );
      }

      // Also invalidate to ensure we get fresh data
      if (variables.boardId) {
        queryClient.invalidateQueries({
          queryKey: jobQueryKeys.list(variables.boardId),
        });
      }
    },

    // After successful update, invalidate the query to ensure consistency
    onSettled: (data, error, variables) => {
      if (variables.boardId) {
        // We wait slightly to avoid UI flickering but ensure data consistency
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: jobQueryKeys.list(variables.boardId!),
          });
        }, 500);
      }
    },
  });
}
