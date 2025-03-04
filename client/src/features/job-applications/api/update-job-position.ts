import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@lib/api-client";
import { jobQueryKeys } from "./job-query-keys";

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

    // We're handling optimistic updates in the BoardView component
    // This is just for error handling and ensuring data consistency

    // If mutation fails, invalidate queries to refetch the correct data
    onError: (error, variables) => {
      if (variables.boardId) {
        queryClient.invalidateQueries({
          queryKey: jobQueryKeys.list(variables.boardId),
        });
      }
    },

    // After successful update, invalidate queries to ensure consistency
    onSuccess: (data, variables) => {
      if (variables.boardId) {
        // We don't immediately invalidate to avoid flickering
        // Instead, we'll schedule an invalidation after a short delay
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: jobQueryKeys.list(variables.boardId!),
          });
        }, 300);
      }
    },
  });
}
