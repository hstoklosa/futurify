import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MutationConfig } from "@lib/react-query";
import { api } from "@lib/api-client";
import { Job } from "@/types/api";

import { jobQueryKeys } from "./job-query-keys";
import { createJobInput } from "@schemas/job-application";

type CreateJobFnData = {
  boardId: number;
  data: Omit<createJobInput, "boardId">;
};

const createJob = async ({
  boardId,
  data,
}: CreateJobFnData): Promise<{ data: Job }> => {
  return api.post(`/jobs/board/${boardId}`, data);
};

export const useCreateJob = ({
  onSuccess,
  ...rest
}: MutationConfig<typeof createJob>) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      const responseJob = data.data;

      // Update the job detail cache
      queryClient.setQueryData(jobQueryKeys.detail(responseJob.id), responseJob);

      // Invalidate the jobs list for the board
      queryClient.invalidateQueries({
        queryKey: jobQueryKeys.list(variables.boardId.toString()),
      });

      // Invalidate the jobs list for the stage
      if (responseJob.stageId) {
        queryClient.invalidateQueries({
          queryKey: jobQueryKeys.listByStage(responseJob.stageId.toString()),
        });
      }

      onSuccess && onSuccess(data, variables, ...args);
    },
    meta: {
      showToast: true,
      toastMessage: "Failed to create job application. Please try again.",
    },
    mutationFn: createJob,
    ...rest,
  });
};
